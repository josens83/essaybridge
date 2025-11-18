import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

const SEO = ({
  title = 'EssayBridge - 논술 전문 교육 플랫폼',
  description = '대학 논술 전형을 위한 전문 첨삭, 1:1 컨설팅, 합격 전략을 제공하는 온라인 교육 플랫폼입니다.',
  keywords = '논술, 대학입시, 논술첨삭, 입시컨설팅, 대학논술, 논술학원, 온라인교육',
  ogImage = '/og-image.png',
  ogType = 'website',
  canonical,
}: SEOProps) => {
  useEffect(() => {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://essaybridge.com';
    const fullTitle = title.includes('EssayBridge') ? title : `${title} | EssayBridge`;
    const canonicalUrl = canonical || siteUrl + window.location.pathname;

    // Update title
    document.title = fullTitle;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector: string, attribute: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        if (attribute === 'property') {
          element.setAttribute('property', selector.match(/\[(.*?)\]/)?.[1] || '');
        } else {
          element.setAttribute('name', selector.match(/\[(.*?)\]/)?.[1] || '');
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update meta tags
    updateMetaTag('meta[name="description"]', 'name', description);
    updateMetaTag('meta[name="keywords"]', 'name', keywords);

    // Open Graph
    updateMetaTag('meta[property="og:title"]', 'property', fullTitle);
    updateMetaTag('meta[property="og:description"]', 'property', description);
    updateMetaTag('meta[property="og:type"]', 'property', ogType);
    updateMetaTag('meta[property="og:url"]', 'property', canonicalUrl);
    updateMetaTag('meta[property="og:image"]', 'property', ogImage);
    updateMetaTag('meta[property="og:site_name"]', 'property', 'EssayBridge');
    updateMetaTag('meta[property="og:locale"]', 'property', 'ko_KR');

    // Twitter Card
    updateMetaTag('meta[name="twitter:card"]', 'name', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'name', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', 'name', description);
    updateMetaTag('meta[name="twitter:image"]', 'name', ogImage);

    // Canonical URL
    let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      document.head.appendChild(linkElement);
    }
    linkElement.setAttribute('href', canonicalUrl);
  }, [title, description, keywords, ogImage, ogType, canonical]);

  return null;
};

export default SEO;
