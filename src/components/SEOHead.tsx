import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEOHead = ({ 
  title, 
  description, 
  image, 
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'article'
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = `${title} | BOBOH HOUSE MEDIA`;

    // Helper function to update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = true) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description, false);

    // Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:type', type);
    updateMetaTag('og:url', url);
    if (image) {
      updateMetaTag('og:image', image);
    }
    updateMetaTag('og:site_name', 'BOBOH HOUSE MEDIA');
    updateMetaTag('og:locale', 'fr_FR');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', false);
    updateMetaTag('twitter:title', title, false);
    updateMetaTag('twitter:description', description, false);
    if (image) {
      updateMetaTag('twitter:image', image, false);
    }

    // Cleanup function to restore default meta on unmount
    return () => {
      document.title = 'BOBOH HOUSE MEDIA';
    };
  }, [title, description, image, url, type]);

  return null;
};
