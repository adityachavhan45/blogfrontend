import React from 'react';
import SEOHead from './SEOHead';

const HomeSEO = () => {
  // Define homepage-specific SEO content
  const title = "LikhoVerse - Your Knowledge Hub";
  const description = "Discover insightful blogs, articles, and knowledge sharing on LikhoVerse. Join our community of readers and writers to explore diverse topics and expand your knowledge.";
  const keywords = [
    "blog platform", 
    "knowledge sharing", 
    "article writing", 
    "reading community", 
    "LikhoVerse", 
    "blogging", 
    "content creation"
  ];
  
  // Create structured data for the homepage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "LikhoVerse",
    "url": "https://likhoverse.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://likhoverse.in/blogs/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "description": description,
    "publisher": {
      "@type": "Organization",
      "name": "LikhoVerse",
      "logo": {
        "@type": "ImageObject",
        "url": "https://likhoverse.in/LikhoVerse.png"
      }
    }
  };

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords}
      ogImage="/home-banner.jpg"
      ogType="website"
      canonicalUrl="/"
      structuredData={structuredData}
    />
  );
};

export default HomeSEO;
