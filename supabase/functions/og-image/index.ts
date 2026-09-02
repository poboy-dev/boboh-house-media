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
import { Image } from "https://deno.land/x/imagescript@1.2.17/mod.ts";

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
    const etag = `W/"ogc2-${article.id}-${new Date(article.updated_at ?? 0).getTime()}"`;
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

    let bytes = new Uint8Array(await upstream.arrayBuffer());
    let outType = contentType;

    // WhatsApp ignore les aperçus dont l'image dépasse ~600 Ko et préfère un
    // ratio proche de 1.91:1. On normalise donc : 1200x630 max, JPEG compressé.
    try {
      const image = await Image.decode(bytes);
      const TARGET_W = 1200;
      const TARGET_H = 630;
      const scale = Math.max(TARGET_W / image.width, TARGET_H / image.height);
      const resized = image.resize(
        Math.max(TARGET_W, Math.round(image.width * scale)),
        Math.max(TARGET_H, Math.round(image.height * scale)),
      );
      resized.crop(
        Math.max(0, Math.round((resized.width - TARGET_W) / 2)),
        Math.max(0, Math.round((resized.height - TARGET_H) / 2)),
        Math.min(TARGET_W, resized.width),
        Math.min(TARGET_H, resized.height),
      );
      let encoded = await resized.encodeJPEG(82);
      if (encoded.byteLength > 300_000) encoded = await resized.encodeJPEG(65);
      bytes = encoded;
      outType = "image/jpeg";
    } catch (_e) {
      // Si le décodage échoue, on sert l'original tel quel.
    }

    return new Response(req.method === "HEAD" ? null : bytes, {
      status: 200,
      headers: {
        ...baseHeaders,
        "Content-Type": outType,
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
