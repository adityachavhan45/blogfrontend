/**
 * Utility functions for SEO optimization
 * These functions directly manipulate the document's meta tags
 */

/**
 * Update the meta tags for a blog post
 * @param {Object} blog - The blog post object
 */
export const updateBlogMetaTags = (blog) => {
  if (!blog) return;

  // Update the page title
  document.title = `${blog.title} | LikhoVerse`;

  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', blog.summary || (blog.content && blog.content.substring(0, 160).replace(/<[^>]*>/g, '')));
  }

  // Update meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords && blog.tags && blog.tags.length > 0) {
    metaKeywords.setAttribute('content', [...blog.tags, 'blog', 'article', 'likhoverse'].join(', '));
  }

  // Update Open Graph meta tags
  updateOpenGraphTags({
    title: `${blog.title} | LikhoVerse`,
    description: blog.summary || (blog.content && blog.content.substring(0, 160).replace(/<[^>]*>/g, '')),
    url: `${window.location.origin}/blog/${blog._id}`,
    image: blog.coverImage ? `${import.meta.env.VITE_API_URL}${blog.coverImage}` : '/LikhoVerse.png',
    type: 'article'
  });

  // Update Twitter Card meta tags
  updateTwitterTags({
    title: `${blog.title} | LikhoVerse`,
    description: blog.summary || (blog.content && blog.content.substring(0, 160).replace(/<[^>]*>/g, '')),
    image: blog.coverImage ? `${import.meta.env.VITE_API_URL}${blog.coverImage}` : '/LikhoVerse.png'
  });

  // Update canonical URL
  updateCanonicalUrl(`${window.location.origin}/blog/${blog._id}`);

  // Add article specific meta tags
  if (blog.createdAt) {
    updateOrCreateMetaTag('property', 'article:published_time', blog.createdAt);
  }
  if (blog.updatedAt) {
    updateOrCreateMetaTag('property', 'article:modified_time', blog.updatedAt);
  }
  if (blog.author && blog.author.name) {
    updateOrCreateMetaTag('property', 'article:author', blog.author.name);
  }

  // Add article tags
  if (blog.tags && blog.tags.length > 0) {
    // First remove any existing article:tag meta tags
    removeMetaTags('property', 'article:tag');
    
    // Then add new ones
    blog.tags.forEach(tag => {
      createMetaTag('property', 'article:tag', tag);
    });
  }
};

/**
 * Update Open Graph meta tags
 * @param {Object} data - The Open Graph data
 */
export const updateOpenGraphTags = ({ title, description, url, image, type = 'website' }) => {
  updateOrCreateMetaTag('property', 'og:title', title);
  updateOrCreateMetaTag('property', 'og:description', description);
  updateOrCreateMetaTag('property', 'og:url', url);
  updateOrCreateMetaTag('property', 'og:image', image);
  updateOrCreateMetaTag('property', 'og:type', type);
};

/**
 * Update Twitter Card meta tags
 * @param {Object} data - The Twitter Card data
 */
export const updateTwitterTags = ({ title, description, image }) => {
  updateOrCreateMetaTag('property', 'twitter:title', title);
  updateOrCreateMetaTag('property', 'twitter:description', description);
  updateOrCreateMetaTag('property', 'twitter:image', image);
};

/**
 * Update the canonical URL
 * @param {string} url - The canonical URL
 */
export const updateCanonicalUrl = (url) => {
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute('href', url);
  } else {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', url);
    document.head.appendChild(canonicalLink);
  }
};

/**
 * Update or create a meta tag
 * @param {string} attributeName - The attribute name (name or property)
 * @param {string} attributeValue - The attribute value
 * @param {string} content - The content value
 */
export const updateOrCreateMetaTag = (attributeName, attributeValue, content) => {
  let metaTag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (metaTag) {
    metaTag.setAttribute('content', content);
  } else {
    createMetaTag(attributeName, attributeValue, content);
  }
};

/**
 * Create a meta tag
 * @param {string} attributeName - The attribute name (name or property)
 * @param {string} attributeValue - The attribute value
 * @param {string} content - The content value
 */
export const createMetaTag = (attributeName, attributeValue, content) => {
  const metaTag = document.createElement('meta');
  metaTag.setAttribute(attributeName, attributeValue);
  metaTag.setAttribute('content', content);
  document.head.appendChild(metaTag);
};

/**
 * Remove meta tags with specific attribute and value
 * @param {string} attributeName - The attribute name (name or property)
 * @param {string} attributeValue - The attribute value
 */
export const removeMetaTags = (attributeName, attributeValue) => {
  const metaTags = document.querySelectorAll(`meta[${attributeName}="${attributeValue}"]`);
  metaTags.forEach(tag => tag.remove());
};
