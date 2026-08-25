import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!;
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:contact@boboh-house-media.com';

const SITE_URL = 'https://boboh-house-media.com';

// ---------- encoding helpers ----------
const enc = new TextEncoder();

function b64urlToBytes(input: string): Uint8Array {
  const pad = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = pad + '='.repeat((4 - (pad.length % 4)) % 4);
  const raw = atob(padded);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function bytesToB64url(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function concat(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((n, a) => n + a.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
}

// ---------- VAPID JWT (ES256) ----------
async function importVapidPrivateKey(): Promise<CryptoKey> {
  const pub = b64urlToBytes(VAPID_PUBLIC_KEY); // 65 bytes: 0x04 || X || Y
  const jwk: JsonWebKey = {
    kty: 'EC',
    crv: 'P-256',
    d: VAPID_PRIVATE_KEY,
    x: bytesToB64url(pub.slice(1, 33)),
    y: bytesToB64url(pub.slice(33, 65)),
    ext: true,
  };
  return await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
}

async function createVapidJwt(audience: string, key: CryptoKey): Promise<string> {
  const header = bytesToB64url(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const payload = bytesToB64url(
    enc.encode(
      JSON.stringify({
        aud: audience,
        exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
        sub: VAPID_SUBJECT,
      }),
    ),
  );
  const unsigned = `${header}.${payload}`;
  const sig = new Uint8Array(
    await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(unsigned)),
  );
  return `${unsigned}.${bytesToB64url(sig)}`;
}

// ---------- aes128gcm payload encryption (RFC 8291) ----------
async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, length: number) {
  const key = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, key, length * 8);
  return new Uint8Array(bits);
}

async function encryptPayload(payload: string, p256dh: string, authSecret: string): Promise<Uint8Array> {
  const clientPub = b64urlToBytes(p256dh);
  const auth = b64urlToBytes(authSecret);

  const serverKeys = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, [
    'deriveBits',
  ]);
  const serverPub = new Uint8Array(await crypto.subtle.exportKey('raw', serverKeys.publicKey));

  const clientKey = await crypto.subtle.importKey(
    'raw',
    clientPub,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    [],
  );
  const shared = new Uint8Array(
    await crypto.subtle.deriveBits({ name: 'ECDH', public: clientKey }, serverKeys.privateKey, 256),
  );

  const salt = crypto.getRandomValues(new Uint8Array(16));

  const prkInfo = concat(enc.encode('WebPush: info\0'), clientPub, serverPub);
  const ikm = await hkdf(auth, shared, prkInfo, 32);

  const cekBytes = await hkdf(salt, ikm, enc.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(salt, ikm, enc.encode('Content-Encoding: nonce\0'), 12);

  const cek = await crypto.subtle.importKey('raw', cekBytes, 'AES-GCM', false, ['encrypt']);
  const plaintext = concat(enc.encode(payload), new Uint8Array([0x02]));
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce, tagLength: 128 }, cek, plaintext),
  );

  const recordSize = new Uint8Array(4);
  new DataView(recordSize.buffer).setUint32(0, 4096);

  return concat(salt, recordSize, new Uint8Array([serverPub.length]), serverPub, ciphertext);
}

// ---------- main ----------
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const articleId: string | undefined = body?.article_id ?? body?.record?.id;

    if (!articleId || typeof articleId !== 'string') {
      return new Response(JSON.stringify({ error: 'article_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select('id, title, description, image')
      .eq('id', articleId)
      .maybeSingle();

    if (articleError) throw articleError;
    if (!article) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: subs, error: subsError } = await supabase
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth');

    if (subsError) throw subsError;

    if (!subs || subs.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'No subscriptions' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const notification = JSON.stringify({
      title: 'Nouvel article sur Boboh House Media',
      body: article.title,
      description: article.description ?? '',
      image: article.image ?? null,
      url: `${SITE_URL}/articles/${article.id}`,
    });

    const vapidKey = await importVapidPrivateKey();
    const staleIds: string[] = [];
    let sent = 0;

    for (const sub of subs) {
      try {
        const url = new URL(sub.endpoint);
        const jwt = await createVapidJwt(url.origin, vapidKey);
        const encrypted = await encryptPayload(notification, sub.p256dh, sub.auth);

        const res = await fetch(sub.endpoint, {
          method: 'POST',
          headers: {
            Authorization: `vapid t=${jwt}, k=${VAPID_PUBLIC_KEY}`,
            'Content-Encoding': 'aes128gcm',
            'Content-Type': 'application/octet-stream',
            TTL: '86400',
            Urgency: 'normal',
          },
          body: encrypted,
        });

        if (res.status === 404 || res.status === 410) {
          staleIds.push(sub.id);
        } else if (!res.ok) {
          console.error(`Push failed [${res.status}] for ${sub.endpoint}: ${await res.text()}`);
        } else {
          sent++;
        }
      } catch (err) {
        console.error('Error sending push to subscription', sub.id, err);
      }
    }

    if (staleIds.length > 0) {
      await supabase.from('push_subscriptions').delete().in('id', staleIds);
    }

    return new Response(JSON.stringify({ sent, removed: staleIds.length, total: subs.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('notify-new-article error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
