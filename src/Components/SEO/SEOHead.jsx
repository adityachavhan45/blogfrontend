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
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content="LikhoVerse" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
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
