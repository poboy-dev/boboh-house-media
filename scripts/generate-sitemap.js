/**
 * Sitemap Generator Script
 * 
 * This script generates a complete sitemap.xml by fetching all articles and categories
 * from your Supabase database. Run this script periodically or during build to keep
 * your sitemap up-to-date.
 * 
 * Usage:
 *   node scripts/generate-sitemap.js
 * 
 * Or add to package.json:
 *   "generate-sitemap": "node scripts/generate-sitemap.js"
 */

// Load .env variables into process.env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, etc.)
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your environment variables');
  console.error('You can create a .env file with these values or export them in your shell');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const baseUrl = 'https://boboh-house-media.com';
const currentDate = new Date().toISOString().split('T')[0];

// Format date for sitemap (YYYY-MM-DD)
function formatDate(dateString) {
  if (!dateString) return currentDate;
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch {
    return currentDate;
  }
}

// Escape XML special characters
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...');
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/portfolio</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${baseUrl}/bobohgeek</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/bh-association</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

`;

  try {
    // Fetch all categories
    console.log('📂 Fetching categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('article_categories')
      .select('slug, updated_at, created_at')
      .order('name');

    if (categoriesError) {
      console.warn('⚠️  Warning: Could not fetch categories:', categoriesError.message);
    } else if (categories && categories.length > 0) {
      console.log(`   Found ${categories.length} categories`);
      categories.forEach((category) => {
        const lastmod = formatDate(category.updated_at || category.created_at);
        sitemap += `  <!-- Category: ${escapeXml(category.slug)} -->
  <url>
    <loc>${baseUrl}/category/${escapeXml(category.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

`;
      });
    }

    // Fetch all published articles
    console.log('📰 Fetching articles...');
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, updated_at, created_at')
      .order('created_at', { ascending: false });

    if (articlesError) {
      console.error('❌ Error fetching articles:', articlesError.message);
      throw articlesError;
    } else if (articles && articles.length > 0) {
      console.log(`   Found ${articles.length} articles`);
      articles.forEach((article) => {
        const lastmod = formatDate(article.updated_at || article.created_at);
        sitemap += `  <!-- Article: ${escapeXml(article.id)} -->
  <url>
    <loc>${baseUrl}/articles/${escapeXml(article.id)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

`;
      });
    } else {
      console.log('   No articles found');
    }

    sitemap += '</urlset>\n';

    // Write to file (in public folder so Vite copies it to dist root)
    const sitemapPath = join(__dirname, '..', 'public', 'sitemap.xml');
    writeFileSync(sitemapPath, sitemap, 'utf8');
    
    const totalUrls = 6 + (categories?.length || 0) + (articles?.length || 0);
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   Total URLs: ${totalUrls}`);
    console.log(`   Saved to: ${sitemapPath}`);
    console.log(`\n📝 Next steps:`);
    console.log(`   1. Submit your sitemap to Google Search Console: https://search.google.com/search-console`);
    console.log(`   2. Add sitemap URL to robots.txt: Sitemap: ${baseUrl}/sitemap.xml`);
    console.log(`   3. Run this script regularly (weekly/monthly) to keep it updated`);

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();

