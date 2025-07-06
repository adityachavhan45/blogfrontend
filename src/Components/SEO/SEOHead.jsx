import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title, 
  description, 
  keywords = [], 
  ogImage = '', 
  ogType = 'website', 
  canonicalUrl = '',
  structuredData = null,
  publishedTime = '',
  modifiedTime = '',
  author = '',
  locale = 'en_US',
  twitterCard = 'summary_large_image',
  twitterSite = '@likhoverse',
  articleTags = []
}) => {
  // Format the title to include the site name
  const formattedTitle = title ? `${title} | LikhoVerse` : 'LikhoVerse - Your Knowledge Hub';
  
  // Default description if none provided
  const defaultDescription = 'LikhoVerse is a platform for insightful blogs, articles, and knowledge sharing. Explore our content and join our community of readers and writers.';
  
  // Ensure image URLs are absolute
  const ensureAbsoluteUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    
    // If it's a relative URL starting with /, ensure it has the correct domain
    if (url.startsWith('/')) {
      // Use the site's domain for production or localhost for development
      const domain = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
        ? `${window.location.protocol}//${window.location.host}`
        : 'https://likhoverse.in';
      return `${domain}${url}`;
    }
    
    // If it's a path from the API
    if (url.includes('/uploads/')) {
      return `${import.meta.env.VITE_API_URL}${url}`; // Ensure full URL from the API
    }
    
    return url;
  };
  
  // Ensure canonical URL is absolute
  const absoluteCanonicalUrl = canonicalUrl 
    ? (canonicalUrl.startsWith('http') ? canonicalUrl : `https://likhoverse.in${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`)
    : '';
  
  // Ensure ogImage is absolute
  const absoluteOgImage = ensureAbsoluteUrl(ogImage);
  
  // Update document title directly for better SEO - this is now handled in the component directly
  // to ensure it works with direct DOM manipulation in the BlogDetail component
  
  return (
    <Helmet prioritizeSeoTags>
      {/* Basic Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#0f1117" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Canonical URL */}
      {absoluteCanonicalUrl && <link rel="canonical" href={absoluteCanonicalUrl} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={ogType} />
      {absoluteOgImage && <meta property="og:image" content={absoluteOgImage} />}
      {absoluteOgImage && <meta property="og:image:width" content="1200" />}
      {absoluteOgImage && <meta property="og:image:height" content="630" />}
      {absoluteCanonicalUrl && <meta property="og:url" content={absoluteCanonicalUrl} />}
      <meta property="og:site_name" content="LikhoVerse" />
      <meta property="og:locale" content={locale} />
      
      {/* Article Specific Open Graph Tags */}
      {ogType === 'article' && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {ogType === 'article' && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {ogType === 'article' && author && <meta property="article:author" content={author} />}
      {ogType === 'article' && articleTags.length > 0 && 
        articleTags.map((tag, index) => (
          <meta key={`article:tag:${index}`} property="article:tag" content={tag} />
        ))
      }
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {absoluteOgImage && <meta name="twitter:image" content={absoluteOgImage} />}
      
      {/* Structured Data for SEO */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Preconnect to important domains */}
      <link rel="preconnect" href={import.meta.env.VITE_API_URL} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default SEOHead;
