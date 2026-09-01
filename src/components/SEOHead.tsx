import { useEffect } from 'react';

export const SITE_URL = 'https://www.boboh-house-media.com';
const SITE_NAME = 'BOBOH HOUSE MEDIA';

interface SEOHeadProps {
  title: string;
  description: string;
  /** Image principale de l'article (fallback si pas d'articleId) */
  image?: string;
  /** URL canonique de la page */
  url?: string;
  type?: string;
  /** UUID de l'article : sert à construire l'URL OG sur notre propre domaine */
  articleId?: string;
  publishedTime?: string;
  author?: string;
  section?: string;
}

export const SEOHead = ({
  title,
  description,
  image,
  url,
  type = 'article',
  articleId,
  publishedTime,
  author,
  section,
}: SEOHeadProps) => {
  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`;

    const canonical = url
      ?? (articleId ? `${SITE_URL}/articles/${articleId}` : (typeof window !== 'undefined' ? window.location.href : SITE_URL));

    // L'image OG passe toujours par notre domaine (jamais l'URL Supabase brute).
    const ogImage = articleId ? `${SITE_URL}/og/article/${articleId}` : image;

    const setMeta = (key: string, content: string, isProperty = true) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setCanonical = (href: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    setMeta('description', description, false);
    setCanonical(canonical);

    setMeta('og:type', type);
    setMeta('og:title', title);
    setMeta('og:description', description);
    setMeta('og:url', canonical);
    setMeta('og:site_name', SITE_NAME);
    setMeta('og:locale', 'fr_FR');
    if (ogImage) {
      setMeta('og:image', ogImage);
      setMeta('og:image:secure_url', ogImage);
      setMeta('og:image:alt', title);
    }
    if (publishedTime) setMeta('article:published_time', publishedTime);
    if (author) setMeta('article:author', author);
    if (section) setMeta('article:section', section);

    setMeta('twitter:card', 'summary_large_image', false);
    setMeta('twitter:title', title, false);
    setMeta('twitter:description', description, false);
    setMeta('twitter:url', canonical, false);
    if (ogImage) setMeta('twitter:image', ogImage, false);

    return () => {
      document.title = SITE_NAME;
    };
  }, [title, description, image, url, type, articleId, publishedTime, author, section]);

  return null;
};
