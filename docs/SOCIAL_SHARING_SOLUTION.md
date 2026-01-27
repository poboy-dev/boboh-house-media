# Solution de Partage Social avec Aperçus Dynamiques

## Problème Rencontré

Lors du partage d'articles sur les réseaux sociaux (WhatsApp, Facebook, Twitter), les utilisateurs rencontraient les problèmes suivants :

1. **Aperçus incorrects** : L'image, le titre et la description de l'article ne s'affichaient pas dans l'aperçu du lien
2. **Redirection vers du code HTML** : Les utilisateurs voyaient une page de code brut au lieu d'être redirigés vers l'article
3. **Échec de la redirection JavaScript** : Les navigateurs intégrés des applications (in-app browsers) bloquent ou limitent l'exécution JavaScript

## Cause Racine

Les plateformes sociales (WhatsApp, Facebook, etc.) utilisent des **robots d'exploration (crawlers)** pour extraire les métadonnées Open Graph d'une URL. Ces robots :
- N'exécutent **pas** le JavaScript
- Lisent uniquement le HTML statique et les balises `<meta>`

Cependant, les **utilisateurs humains** qui cliquent sur le lien :
- Utilisent des navigateurs qui peuvent exécuter JavaScript
- Mais les navigateurs intégrés des apps peuvent bloquer les redirections JS

## Solution Implémentée

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Edge Function (og-image)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Requête entrante                                            │
│       │                                                      │
│       ▼                                                      │
│  ┌─────────────────┐                                         │
│  │ Analyse du      │                                         │
│  │ User-Agent      │                                         │
│  └────────┬────────┘                                         │
│           │                                                  │
│     ┌─────┴─────┐                                            │
│     ▼           ▼                                            │
│ ┌───────┐  ┌────────┐                                        │
│ │ Bot ? │  │ Humain │                                        │
│ └───┬───┘  └────┬───┘                                        │
│     │           │                                            │
│     ▼           ▼                                            │
│ ┌───────────┐ ┌─────────────────┐                            │
│ │ HTML avec │ │ Redirection 302 │                            │
│ │ meta OG   │ │ vers l'article  │                            │
│ └───────────┘ └─────────────────┘                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Méthodologie : Détection User-Agent + Redirection Conditionnelle

#### 1. Détection des Crawlers Sociaux

```typescript
const userAgent = (req.headers.get('user-agent') || '').toLowerCase();
const isSocialCrawler = /(facebookexternalhit|facebot|twitterbot|whatsapp|telegrambot|slackbot|discordbot|linkedinbot|pinterest|googlebot|bingbot|embedly|crawler|bot)/i.test(userAgent);
```

#### 2. Réponse pour les Robots (Crawlers)

Les robots reçoivent une page HTML complète avec les balises Open Graph :

```html
<meta property="og:title" content="Titre de l'article">
<meta property="og:description" content="Description...">
<meta property="og:image" content="https://...image.jpg">
<meta property="og:url" content="https://boboh-house-media.com/articles/xxx">
```

#### 3. Réponse pour les Humains

Les utilisateurs humains reçoivent une **redirection HTTP 302** immédiate :

```typescript
if (!isSocialCrawler) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: articleUrl,  // URL directe de l'article
      'Cache-Control': 'no-store',
      'Vary': 'User-Agent',
    },
  });
}
```

### Avantages de cette Solution

| Aspect | Bénéfice |
|--------|----------|
| **Fiabilité** | Redirection HTTP native, fonctionne dans tous les navigateurs |
| **Performance** | Pas d'attente de chargement JavaScript pour les humains |
| **SEO** | Les robots reçoivent les métadonnées complètes |
| **Cache** | `Vary: User-Agent` garantit des réponses distinctes pour bots/humains |

## Fichiers Impliqués

### Edge Function
- **Fichier** : `supabase/functions/og-image/index.ts`
- **Rôle** : Sert les métadonnées OG aux bots, redirige les humains

### Composant de Partage
- **Fichier** : `src/components/ShareButton.tsx`
- **Rôle** : Génère les liens de partage pointant vers l'Edge Function

## Configuration Requise

### supabase/config.toml
```toml
[functions.og-image]
verify_jwt = false  # Permet l'accès public pour les crawlers
```

### URL de Partage
```
https://yxiocwtfejvgtupqtcnx.supabase.co/functions/v1/og-image?id={article_id}
```

## Test de la Solution

### 1. Tester l'aperçu (pour les bots)
Utiliser le [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) avec l'URL de l'Edge Function.

### 2. Tester la redirection (pour les humains)
Ouvrir l'URL dans un navigateur normal → doit rediriger vers `https://boboh-house-media.com/articles/{id}`

### 3. Tester sur WhatsApp
Coller le lien dans une conversation → l'aperçu doit afficher l'image et le titre de l'article.

## Évolutions Possibles

1. **Proxy sur le domaine principal** : Créer une route `/share/:id` sur le domaine pour éviter d'exposer l'URL Supabase
2. **Cache avec ETag** : Optimiser les performances pour les requêtes répétées
3. **Analytics de partage** : Tracker les partages par plateforme
