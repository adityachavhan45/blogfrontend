import { Helmet } from 'react-helmet-async';

/**
 * Return Helmet component with SEO meta tags for a blog post.
 * @param {Object} blog Blog object containing title, excerpt, content, coverImage, _id, etc.
 */
export const updateBlogMetaTags = (blog) => {
  if (!blog) return null;

  const metaTitle = blog.title;
  const metaDescription =
    blog.excerpt ||
    (blog.content && blog.content.replace(/<[^>]*>/g, '').substring(0, 160));
  const imageUrl = blog.coverImage
    ? `${import.meta.env.VITE_API_URL}${blog.coverImage}`
    : '/LikhoVerse.png';
  const blogUrl = `${window.location.origin}/blogs/${blog._id}`;

  return (
    <Helmet>
      <title>{`${metaTitle} | LikhoVerse`}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
      <link rel="canonical" href={blogUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={metaTitle} />
      {metaDescription && <meta property="og:description" content={metaDescription} />}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={blogUrl} />
      <meta property="og:type" content="article" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      {metaDescription && <meta name="twitter:description" content={metaDescription} />}
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};
