/**
 * Utility functions for generating and injecting structured data (JSON-LD)
 * These functions help search engines better understand the content
 */

/**
 * Generate and inject structured data for a blog post
 * @param {Object} blog - The blog post object
 */
export const injectBlogStructuredData = (blog) => {
  if (!blog) return;

  // Remove any existing structured data
  removeStructuredData();

  // Create structured data for blog post
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': blog.title,
    'description': blog.summary || (blog.content && blog.content.substring(0, 160).replace(/<[^>]*>/g, '')),
    'image': blog.coverImage ? ensureAbsoluteUrl(blog.coverImage) : '',
    'datePublished': blog.createdAt,
    'dateModified': blog.updatedAt,
    'author': {
      '@type': 'Person',
      'name': blog.author?.name || 'LikhoVerse Author'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'LikhoVerse',
      'logo': {
        '@type': 'ImageObject',
        'url': `${getSiteOrigin()}/LikhoVerse.png`
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': getCurrentUrl()
    }
  };

  // Inject the structured data into the page
  injectStructuredData(structuredData);
};

/**
 * Generate and inject structured data for the homepage
 */
export const injectHomeStructuredData = () => {
  // Remove any existing structured data
  removeStructuredData();

  // Create structured data for homepage
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'LikhoVerse',
    'url': getSiteOrigin(),
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${getSiteOrigin()}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    'description': 'LikhoVerse is a platform for insightful blogs, articles, and knowledge sharing. Explore our content and join our community of readers and writers.',
    'publisher': {
      '@type': 'Organization',
      'name': 'LikhoVerse',
      'logo': {
        '@type': 'ImageObject',
        'url': `${getSiteOrigin()}/LikhoVerse.png`
      }
    }
  };

  // Inject the structured data into the page
  injectStructuredData(structuredData);
};

/**
 * Generate and inject structured data for blog listing page
 * @param {string} category - Optional category name
 */
export const injectBlogListStructuredData = (category = '') => {
  // Remove any existing structured data
  removeStructuredData();

  // Create structured data for blog listing
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': category ? `${category} Blogs - LikhoVerse` : 'Blogs & Articles - LikhoVerse',
    'description': category 
      ? `Explore our collection of ${category} blogs and articles. Find insightful content, expert opinions, and the latest information.`
      : 'Browse through our extensive collection of blogs and articles on various topics. Find insightful content, expert opinions, and the latest information.',
    'url': category 
      ? `${getSiteOrigin()}/blogs/category/${category.toLowerCase()}`
      : `${getSiteOrigin()}/blogs`,
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'LikhoVerse',
      'url': getSiteOrigin()
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'LikhoVerse',
      'logo': {
        '@type': 'ImageObject',
        'url': `${getSiteOrigin()}/LikhoVerse.png`
      }
    }
  };

  // Inject the structured data into the page
  injectStructuredData(structuredData);
};

/**
 * Inject structured data into the page
 * @param {Object} data - The structured data object
 */
export const injectStructuredData = (data) => {
  // Create a script element
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'structured-data';
  script.innerHTML = JSON.stringify(data);
  
  // Append to the head
  document.head.appendChild(script);
};

/**
 * Remove existing structured data from the page
 */
export const removeStructuredData = () => {
  const existingScript = document.getElementById('structured-data');
  if (existingScript) {
    existingScript.remove();
  }
};

/**
 * Helper function to ensure URLs are absolute
 * @param {string} url - The URL to check
 * @returns {string} - The absolute URL
 */
export const ensureAbsoluteUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  // For API URLs
  if (url.startsWith('/uploads/') || url.startsWith('/api/')) {
    return `${import.meta.env.VITE_API_URL}${url}`;
  }
  
  // For static assets and other URLs
  return `${getSiteOrigin()}${url.startsWith('/') ? url : `/${url}`}`;
};

/**
 * Get the current URL
 * @returns {string} - The current URL
 */
export const getCurrentUrl = () => {
  return window.location.href;
};

/**
 * Get the site origin
 * @returns {string} - The site origin
 */
export const getSiteOrigin = () => {
  return window.location.origin;
};
