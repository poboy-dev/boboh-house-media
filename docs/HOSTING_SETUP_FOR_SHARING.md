# Configuration de l'Hébergement pour le Partage via Barre d'Adresse

Pour que le partage fonctionne même en copiant le lien directement depuis la barre d'adresse du navigateur (ex: `https://boboh-house-media.com/articles/123`), vous devez configurer votre hébergeur pour rediriger les robots vers la fonction Edge Supabase.

Actuellement, votre site est une SPA (Single Page Application). Si un robot visite l'URL directe, il ne voit que le code vide de l'application React.

Voici comment configurer cela selon votre hébergeur :

## Option 1 : Netlify (Recommandé)

Si vous hébergez sur Netlify, créez un fichier `netlify.toml` à la racine du projet avec ce contenu :

```toml
[[edge_functions]]
  path = "/articles/*"
  function = "proxy-share"
```

Ensuite, créez un fichier `netlify/edge-functions/proxy-share.ts` :

```typescript
import { Context } from "netlify:edge";

export default async (request: Request, context: Context) => {
  const userAgent = request.headers.get("user-agent") || "";
  const isBot = /(facebookexternalhit|twitterbot|whatsapp|linkedinbot|pinterest|googlebot|bingbot|slackbot)/i.test(userAgent);

  if (isBot) {
    // Extraire l'ID de l'article de l'URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const articleId = pathParts[pathParts.length - 1]; // Supposant /articles/ID

    if (articleId) {
      // Rediriger le bot vers la fonction Supabase qui génère les tags
      return Response.redirect(`https://yxiocwtfejvgtupqtcnx.supabase.co/functions/v1/og-image?id=${articleId}`, 302);
      
      // Alternativement, vous pouvez faire un fetch et renvoyer le contenu directement (meilleur pour SEO)
      // const response = await fetch(`https://yxiocwtfejvgtupqtcnx.supabase.co/functions/v1/og-image?id=${articleId}`);
      // return response;
    }
  }

  return context.next();
};
```

## Option 2 : Vercel

Si vous hébergez sur Vercel, utilisez le Middleware. Créez `middleware.ts` à la racine :

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /(facebookexternalhit|twitterbot|whatsapp|linkedinbot|pinterest|googlebot|bingbot|slackbot)/i.test(userAgent);

  if (isBot && request.nextUrl.pathname.startsWith('/articles/')) {
    const articleId = request.nextUrl.pathname.split('/').pop();
    if (articleId) {
      return NextResponse.rewrite(new URL(`https://yxiocwtfejvgtupqtcnx.supabase.co/functions/v1/og-image?id=${articleId}`));
    }
  }
}

export const config = {
  matcher: '/articles/:path*',
};
```

## Pourquoi est-ce nécessaire ?

Sans cette configuration, seul le bouton "Partager" de l'application génère le bon lien. Le lien affiché dans le navigateur reste le lien "React" qui n'a pas de prévisualisation pour les robots.
