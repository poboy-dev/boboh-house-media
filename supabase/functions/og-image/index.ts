import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// IMPORTANT: set this to your primary (custom) domain.
// If you change domain, update this constant.
const SITE_URL = "https://boboh-house-media.com";
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

    // Build the canonical URL for the article and redirect.
    // NOTE: Supabase Edge Functions currently serve HTML responses with Content-Type: text/plain
    // (plus CSP sandbox), which makes apps like WhatsApp show "raw HTML code" instead of rendering.
    // A proper HTTP redirect avoids that problem.
    const articleUrl = `${SITE_URL}/articles/${articleId}`;

    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: articleUrl,
        'Cache-Control': 'no-store',
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
