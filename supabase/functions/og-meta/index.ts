// @ts-nocheck — Supabase Edge Function (Deno).
// Rôle : servir aux CRAWLERS sociaux le HTML initial d'une page article avec
// les balises Open Graph / Twitter complètes (pas de dépendance au JavaScript).
// Vercel réécrit /articles/:id vers cette fonction uniquement pour les
// User-Agents de crawlers (voir vercel.json). Les humains reçoivent la SPA.
//
// Sécurité : clé ANON (RLS respectée), UUID validé, colonnes publiques
// uniquement, 404 si l'article n'existe pas. Le contenu de l'article n'est
// jamais exposé, seulement titre / description / image.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://www.boboh-house-media.com";
const SITE_NAME = "BOBOH HOUSE MEDIA";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const baseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  Vary: "User-Agent",
};

function escapeHtml(text: string) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function notFound() {
  return new Response("<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"utf-8\"><title>404</title><meta name=\"robots\" content=\"noindex\"></head><body>Article introuvable</body></html>", {
    status: 404,
    headers: { ...baseHeaders, "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=60" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: baseHeaders });

  try {
    const url = new URL(req.url);
    // Accepte ?id=UUID ou le dernier segment du chemin.
    const id = url.searchParams.get("id") || url.pathname.split("/").filter(Boolean).pop() || "";
    if (!UUID_RE.test(id)) return notFound();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    const { data: article, error } = await supabase
      .from("articles")
      .select("id, title, description, author, date, created_at, updated_at, category")
      .eq("id", id)
      .maybeSingle();

    if (error || !article) return notFound();

    const articleUrl = `${SITE_URL}/articles/${article.id}`;
    const ogImage = `${SITE_URL}/og/article/${article.id}`;
    const title = escapeHtml(article.title ?? SITE_NAME);
    const rawDesc = article.description
      ? article.description.substring(0, 200) + (article.description.length > 200 ? "…" : "")
      : `Lisez cet article sur ${SITE_NAME}`;
    const description = escapeHtml(rawDesc);
    const published = escapeHtml(new Date(article.date ?? article.created_at).toISOString());
    const author = escapeHtml(article.author ?? SITE_NAME);
    const section = escapeHtml(article.category ?? "");

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | ${SITE_NAME}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${articleUrl}">

<meta property="og:type" content="article">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${articleUrl}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:secure_url" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${title}">
<meta property="article:published_time" content="${published}">
<meta property="article:author" content="${author}">
${section ? `<meta property="article:section" content="${section}">` : ""}

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${ogImage}">
<meta name="twitter:url" content="${articleUrl}">

<meta http-equiv="refresh" content="0;url=${articleUrl}">
</head>
<body>
<h1>${title}</h1>
<p>${description}</p>
<p><a href="${articleUrl}">Lire l'article sur ${SITE_NAME}</a></p>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        ...baseHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (_e) {
    return notFound();
  }
});
