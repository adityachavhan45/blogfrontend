import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchBlog();
    // Add a class to the body to prevent background color issues
    document.body.classList.add('bg-[#0f1117]');
    return () => {
      document.body.classList.remove('bg-[#0f1117]');
    };
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
      if (!response.ok) throw new Error('Blog not found');
      const data = await response.json();
      setBlog(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1117] py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-400">Loading blog...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#0f1117] py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-red-400">Blog not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <article className="max-w-4xl mx-auto space-y-6">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="relative rounded-2xl overflow-hidden bg-[#1a1d25] shadow-xl">
            <img
              src={`http://localhost:5000${blog.coverImage}`}
              alt={blog.title}
              onClick={() => setShowImageModal(true)}
              className="w-full h-[350px] object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
            />
          </div>
        )}

        <div className="bg-[#1a1d25] rounded-2xl p-8 shadow-xl">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">{blog.title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
            <span className="bg-[#e052a0]/20 text-[#e052a0] px-3 py-1 rounded-full">{blog.category}</span>
            <span className="text-gray-400">{new Date(blog.createdAt).toLocaleDateString()}</span>
            <span className="text-gray-400">{blog.readTime} min read</span>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-gray-400 text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {showImageModal && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <img
              src={`http://localhost:5000${blog.coverImage}`}
              alt={blog.title}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        )}

        <div className="mt-8 bg-[#1a1d25] rounded-2xl p-8 shadow-xl">
          <div className="prose prose-lg max-w-none text-white prose-headings:text-white prose-p:text-white prose-strong:text-white prose-li:text-white prose-blockquote:text-white prose-code:text-white prose-pre:bg-[#0f1117] prose-a:text-[#e052a0] hover:prose-a:text-[#d0408f] prose-img:rounded-lg prose-img:shadow-lg">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blog.content),
              }}
            />
          </div>
        </div>

      </article>
    </div>
  );
};

export default BlogDetail;
