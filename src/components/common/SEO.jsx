import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSEOMetadata, generateStructuredData, SITE_URL } from '../../data/seoData';

/**
 * Universal SEO Component
 * Automatically manages title, meta descriptions, canonical URLs,
 * Open Graph, Twitter Cards, and JSON-LD structured data on route changes.
 */
export default function SEO() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const seo = getSEOMetadata(pathname);

    // 1. Page Title
    document.title = seo.title;

    // Helper function to update or create meta tags
    const setMetaTag = (selector, attributeName, attributeValue, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', seo.description);
    if (seo.keywords) {
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', seo.keywords);
    }
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. Canonical Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seo.canonical || `${SITE_URL}${pathname}`);

    // 4. Open Graph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', seo.title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', seo.description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', seo.canonical || `${SITE_URL}${pathname}`);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', seo.ogType || 'website');
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', seo.ogImage || `${SITE_URL}/aboutus.png`);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'A8Fusion');
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_US');

    // 5. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', seo.ogImage || `${SITE_URL}/aboutus.png`);
    setMetaTag('meta[name="twitter:creator"]', 'name', 'twitter:creator', '@a8fusion');

    // 6. JSON-LD Structured Data
    const structuredData = generateStructuredData(pathname, seo);
    let scriptTag = document.querySelector('#a8-structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'a8-structured-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    // 7. Handle Hash Anchor Scrolling
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}

