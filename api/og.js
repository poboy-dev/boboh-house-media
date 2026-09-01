// Fonction Vercel : re-sert le HTML de l'edge function Supabase `og-meta`
// avec le bon Content-Type (text/html). Supabase force `text/plain` sur les
// réponses HTML de ses edge functions, ce qui empêche WhatsApp / Facebook
// de lire les balises Open Graph.

const SUPABASE_OG_META =
  "https://yxiocwtfejvgtupqtcnx.supabase.co/functions/v1/og-meta";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function handler(req, res) {
  const id = String(req.query.id || "");

  if (!UUID_RE.test(id)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(404).send(
      '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>404</title><meta name="robots" content="noindex"></head><body>Article introuvable</body></html>'
    );
    return;
  }

  try {
    const upstream = await fetch(`${SUPABASE_OG_META}?id=${id}`, {
      headers: { Accept: "text/html" },
    });
    const html = await upstream.text();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Vary", "User-Agent");
    res.setHeader(
      "Cache-Control",
      "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
    );
    res.status(upstream.status).send(html);
  } catch (_e) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(502).send(
      '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Erreur</title></head><body>Service indisponible</body></html>'
    );
  }
}
