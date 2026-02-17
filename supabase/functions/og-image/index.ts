// @ts-nocheck — This is a Deno-based Supabase Edge Function.
// URL imports and the Deno global are valid at runtime but not
// recognized by the Node/TS language server. Install the "Deno"
// VS Code extension (denoland.vscode-deno) for full IDE support.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// IMPORTANT: Update this to your custom domain
const SITE_URL = "https://boboh-house-media.com";
const SITE_NAME = "BOBOH HOUSE MEDIA";

// Escape HTML special characters to prevent XSS
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const articleId = url.searchParams.get('id');

    console.log('OG Image request for article:', articleId);

    if (!articleId) {
      console.error('No article ID provided');
      // Redirect to homepage if no ID
      return new Response(null, {
        status: 302,
        headers: { ...corsHeaders, Location: SITE_URL },
      });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch article data
    const { data: article, error } = await supabase
      .from('articles')
      .select('id, title, description, image, category')
      .eq('id', articleId)
      .single();

    if (error || !article) {
      console.error('Article not found:', error);
      // Redirect to homepage if article not found
      return new Response(null, {
        status: 302,
        headers: { ...corsHeaders, Location: SITE_URL },
      });
    }

    console.log('Article found:', article.title);

    // Build the canonical URL for the article
    const articleUrl = `${SITE_URL}/articles/${article.id}`;

    // Serve OG HTML to social crawlers, and a true HTTP redirect to human browsers.
    // This avoids users seeing a raw HTML page in in-app browsers that block/limit JS.
    const userAgent = (req.headers.get('user-agent') || '').toLowerCase();
    const isSocialCrawler = /(facebookexternalhit|facebot|twitterbot|whatsapp|telegrambot|slackbot|discordbot|linkedinbot|pinterest|googlebot|bingbot|embedly|crawler|bot)/i.test(
      userAgent
    );

    // Ensure image URL is absolute
    let imageUrl = article.image || `${SITE_URL}/og-image.png`;
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${SITE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    // Escape and truncate for meta tags
    const safeTitle = escapeHtml(article.title);
    const description = article.description
      ? escapeHtml(article.description.substring(0, 160) + (article.description.length > 160 ? '...' : ''))
      : `Lisez cet article sur ${SITE_NAME}`;

    // Human users: fast redirect (no HTML rendered)
    if (!isSocialCrawler) {
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          Location: articleUrl,
          'Cache-Control': 'no-store',
          Vary: 'User-Agent',
        },
      });
    }

    // Generate HTML with Open Graph meta tags
    // Social crawlers (Facebook, WhatsApp, Twitter) don't execute JavaScript,
    // so they will read the meta tags. Human users will be redirected via JS.
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>${safeTitle} | ${SITE_NAME}</title>
  <meta name="title" content="${safeTitle} | ${SITE_NAME}">
  <meta name="description" content="${description}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${req.url}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:locale" content="fr_FR">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${req.url}">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="${articleUrl}">
  
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    p { opacity: 0.8; margin-bottom: 1rem; }
    a { color: #60a5fa; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
  
  <!-- JavaScript redirect for human users (bots don't execute JS) -->
  <script>
    window.location.replace("${articleUrl}");
  </script>
</head>
<body>
  <noscript>
    <meta http-equiv="refresh" content="0;url=${articleUrl}">
  </noscript>
  <div class="container">
    <div class="spinner"></div>
    <p>Redirection en cours...</p>
    <p><a href="${articleUrl}">Cliquez ici si vous n'êtes pas redirigé</a></p>
  </div>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        Vary: 'User-Agent',
      },
    });

  } catch (error) {
    console.error('Error in og-image function:', error);
    return new Response('Internal server error', {
      status: 500,
      headers: corsHeaders,
    });
  }
});
