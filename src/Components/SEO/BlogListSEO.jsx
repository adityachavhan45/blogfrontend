import React from 'react';
import SEOHead from './SEOHead';

const BlogListSEO = ({ category = '', page = 1, totalPages = 1 }) => {
  // Define blog listing page-specific SEO content
  const baseTitle = "Blogs & Articles";
  const title = category 
    ? `${category} Blogs - Page ${page} of ${totalPages}` 
    : `${baseTitle} - Page ${page} of ${totalPages}`;
  
  const description = category
    ? `Explore our collection of ${category} blogs and articles. Find insightful content, expert opinions, and the latest information on ${category.toLowerCase()}.`
    : "Browse through our extensive collection of blogs and articles on various topics. Find insightful content, expert opinions, and the latest information on LikhoVerse.";
  
  const keywords = [
    "blog articles", 
    "knowledge sharing", 
    category.toLowerCase(), 
    "LikhoVerse blogs", 
    "reading community", 
    "expert content",
    "blog collection"
  ].filter(Boolean);
  
  // Create structured data for the blog listing page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": `https://likhoverse.in/blogs${category ? `/category/${category.toLowerCase()}` : ''}${page > 1 ? `?page=${page}` : ''}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "LikhoVerse",
      "url": "https://likhoverse.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "LikhoVerse",
      "logo": {
        "@type": "ImageObject",
        "url": "https://likhoverse.in/LikhoVerse.png"
      }
    }
  };

  // Canonical URL should point to the first page if paginated
  const canonicalUrl = category
    ? `/blogs/category/${category.toLowerCase()}${page > 1 ? `?page=${page}` : ''}`
    : `/blogs${page > 1 ? `?page=${page}` : ''}`;

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords}
      ogImage="/blog-listing-banner.jpg"
      ogType="website"
      canonicalUrl={canonicalUrl}
      structuredData={structuredData}
    />
  );
};

export default BlogListSEO;
