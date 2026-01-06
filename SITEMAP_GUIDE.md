# Sitemap Generation Guide

This guide explains how to maintain and update your sitemap.xml for optimal SEO.

## Overview

Your sitemap has been updated to include:
- ✅ All static pages (homepage, services, portfolio, about, contact, etc.)
- ✅ Dynamic article pages (automatically fetched from database)
- ✅ Category pages (automatically fetched from database)
- ✅ Proper SEO metadata (priority, changefreq, lastmod)

## Quick Start

### 1. Generate the Complete Sitemap

Run the sitemap generator script to fetch all articles and categories from your database:

```bash
npm run generate-sitemap
```

**Note:** Make sure you have your Supabase environment variables set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These should be in your `.env` file or exported in your shell.

### 2. Update robots.txt

Make sure your `robots.txt` file references your sitemap. If you don't have one, create it in your `public` folder:

```
User-agent: *
Allow: /

Sitemap: https://boboh-house-media.com/sitemap.xml
```

### 3. Submit to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (if not already added)
3. Navigate to **Sitemaps** in the left menu
4. Enter: `sitemap.xml`
5. Click **Submit**

## When to Regenerate

You should regenerate your sitemap:
- ✅ **After publishing new articles** - Run the script to add new article URLs
- ✅ **After creating new categories** - Run the script to add new category pages
- ✅ **Weekly/Monthly** - Set up a cron job or scheduled task to keep it fresh
- ✅ **Before deploying** - Add to your build process if possible

## Automation Options

### Option 1: Add to Build Process

You can add the sitemap generation to your build script:

```json
"scripts": {
  "build": "npm run generate-sitemap && vite build",
  "prebuild": "npm run generate-sitemap"
}
```

### Option 2: GitHub Actions / CI/CD

Add a step to your CI/CD pipeline to regenerate the sitemap before deployment.

### Option 3: Scheduled Task (Cron)

Set up a cron job to run weekly:

```bash
# Run every Monday at 2 AM
0 2 * * 1 cd /path/to/your/project && npm run generate-sitemap
```

## Sitemap Structure

Your sitemap includes:

| Page Type | Priority | Change Frequency | Example URLs |
|-----------|----------|------------------|--------------|
| Homepage | 1.0 | Daily | `/` |
| Articles | 0.9 | Monthly | `/articles/{id}` |
| Categories | 0.8 | Weekly | `/category/{slug}` |
| Services/Portfolio | 0.8 | Monthly | `/services`, `/portfolio` |
| About/Contact | 0.7 | Monthly/Yearly | `/about`, `/contact` |

## SEO Best Practices

1. **Keep it Updated**: Run the generator regularly to include new content
2. **Submit to Search Engines**: 
   - Google Search Console
   - Bing Webmaster Tools
3. **Monitor**: Check Search Console for sitemap errors
4. **File Size**: If you have more than 50,000 URLs, consider splitting into multiple sitemaps
5. **Compression**: Consider gzipping your sitemap for faster loading

## Troubleshooting

### Script fails with "environment variables not set"
- Create a `.env` file in your project root
- Add: `VITE_SUPABASE_URL=your_url` and `VITE_SUPABASE_ANON_KEY=your_key`

### No articles/categories found
- Check your Supabase connection
- Verify your database tables exist: `articles` and `article_categories`
- Check table permissions (RLS policies)

### Sitemap not updating
- Clear your browser cache
- Check file permissions
- Verify the script ran successfully

## Additional Resources

- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [Google Search Console Help](https://support.google.com/webmasters/answer/7451001)

