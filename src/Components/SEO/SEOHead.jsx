import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title, 
  description, 
  keywords = [], 
  ogImage = '', 
  ogType = 'website', 
  canonicalUrl = '',
  structuredData = null
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
      const domain = window.location.hostname === 'localhost' 
        ? `${window.location.protocol}//${window.location.host}`
        : 'https://likhoverse.in';
      return `${domain}${url}`;
    }
    
    // If it's a path from the API
    if (url.includes('/uploads/')) {
      return url; // This should already be a full URL from the API
    }
    
    return url;
  };
  
  // Ensure canonical URL is absolute
  const absoluteCanonicalUrl = canonicalUrl 
    ? (canonicalUrl.startsWith('http') ? canonicalUrl : `https://likhoverse.in${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`)
    : '';
  
  // Ensure ogImage is absolute
  const absoluteOgImage = ensureAbsoluteUrl(ogImage);
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      
      {/* Canonical URL */}
      {absoluteCanonicalUrl && <link rel="canonical" href={absoluteCanonicalUrl} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={ogType} />
      {absoluteOgImage && <meta property="og:image" content={absoluteOgImage} />}
      {absoluteCanonicalUrl && <meta property="og:url" content={absoluteCanonicalUrl} />}
      <meta property="og:site_name" content="LikhoVerse" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {absoluteOgImage && <meta name="twitter:image" content={absoluteOgImage} />}
      
      {/* Structured Data for SEO */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
