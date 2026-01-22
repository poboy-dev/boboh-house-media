import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_URL = "https://boboh-house-media.lovable.app";
const SITE_NAME = "BOBOH HOUSE MEDIA";

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
      return new Response('Article ID required', { status: 400 });
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
      return new Response('Article not found', { status: 404 });
    }

    console.log('Article found:', article.title);

    // Build the canonical URL for the article
    const articleUrl = `${SITE_URL}/articles/${article.id}`;
    
    // Ensure image URL is absolute
    let imageUrl = article.image || `${SITE_URL}/og-image.png`;
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${SITE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    // Truncate description for meta tags (max 160 chars)
    const description = article.description 
      ? article.description.substring(0, 160) + (article.description.length > 160 ? '...' : '')
      : `Lisez cet article sur ${SITE_NAME}`;

    // Generate HTML with Open Graph meta tags
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>${article.title} | ${SITE_NAME}</title>
  <meta name="title" content="${article.title} | ${SITE_NAME}">
  <meta name="description" content="${description}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${articleUrl}">
  <meta property="og:title" content="${article.title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:locale" content="fr_FR">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${articleUrl}">
  <meta name="twitter:title" content="${article.title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <!-- Redirect to actual article page -->
  <meta http-equiv="refresh" content="0;url=${articleUrl}">
  <link rel="canonical" href="${articleUrl}">
  
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #f5f5f5;
    }
    .loading {
      text-align: center;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="loading">
    <p>Redirection vers l'article...</p>
    <p><a href="${articleUrl}">Cliquez ici si vous n'êtes pas redirigé</a></p>
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
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
