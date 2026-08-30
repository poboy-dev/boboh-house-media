// @ts-nocheck — Supabase Edge Function (Deno).
// Rôle : servir l'IMAGE Open Graph d'un article (binaire), derrière le proxy
// https://www.boboh-house-media.com/og/article/:id
//
// Sécurité :
// - utilise la clé ANON (RLS respectée, aucun bypass, aucun secret exposé) ;
// - valide strictement l'UUID reçu ;
// - ne renvoie AUCUNE donnée de l'article (uniquement des octets d'image) ;
// - n'accepte de proxifier que des images hébergées sur des domaines autorisés
//   (protection contre l'utilisation en open proxy / SSRF) ;
// - 404 si l'article n'existe pas ou n'est pas lisible publiquement.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://www.boboh-house-media.com";
const FALLBACK_IMAGE = `${SITE_URL}/logo.png`;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

const ALLOWED_IMAGE_HOSTS = new Set([
  new URL(supabaseUrl).host,
  "www.boboh-house-media.com",
  "boboh-house-media.com",
  "boboh-house-media.lovable.app",
]);

const baseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "X-Content-Type-Options": "nosniff",
  Vary: "Accept",
};

function notFound() {
  return new Response("Not found", {
    status: 404,
    headers: { ...baseHeaders, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=60" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: baseHeaders });
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: baseHeaders });
  }

  try {
    const id = new URL(req.url).searchParams.get("id") ?? "";
    if (!UUID_RE.test(id)) return notFound();

    const supabase = createClient(supabaseUrl, anonKey);
    // Seulement les colonnes publiques strictement nécessaires.
    const { data: article, error } = await supabase
      .from("articles")
      .select("id, image, updated_at")
      .eq("id", id)
      .maybeSingle();

    if (error || !article) return notFound();

    // ETag basé sur l'article + sa date de mise à jour => invalidation automatique
    // quand l'image ou le contenu de l'article change.
    const etag = `W/"og-${article.id}-${new Date(article.updated_at ?? 0).getTime()}"`;
    if (req.headers.get("if-none-match") === etag) {
      return new Response(null, { status: 304, headers: { ...baseHeaders, ETag: etag } });
    }

    let imageUrl = article.image || FALLBACK_IMAGE;
    if (!/^https?:\/\//i.test(imageUrl)) {
      imageUrl = `${SITE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
    }

    let target: URL;
    try {
      target = new URL(imageUrl);
    } catch {
      target = new URL(FALLBACK_IMAGE);
    }
    if (target.protocol !== "https:" || !ALLOWED_IMAGE_HOSTS.has(target.host)) {
      target = new URL(FALLBACK_IMAGE);
    }

    const upstream = await fetch(target.toString(), {
      headers: { Accept: "image/*" },
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok) return notFound();

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) return notFound();

    const bytes = new Uint8Array(await upstream.arrayBuffer());

    return new Response(req.method === "HEAD" ? null : bytes, {
      status: 200,
      headers: {
        ...baseHeaders,
        "Content-Type": contentType,
        "Content-Length": String(bytes.byteLength),
        ETag: etag,
        // Cache CDN long, revalidation rapide côté client.
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (_e) {
    return notFound();
  }
});
