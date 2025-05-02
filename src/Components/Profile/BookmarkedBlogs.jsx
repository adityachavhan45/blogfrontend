import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBookmark, FaRegBookmark, FaEye } from 'react-icons/fa';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const BookmarkedBlogs = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to view bookmarks');
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/interactions/bookmarks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }
      
      const data = await response.json();
      setBookmarks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setError('Failed to load bookmarks. Please try again later.');
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/interactions/blogs/${blogId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Remove the bookmark from the list
        setBookmarks(prev => prev.filter(blog => blog._id !== blogId));
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchBookmarks}
          className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-800/50 rounded-xl p-8">
        <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaBookmark className="text-gray-500 text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No bookmarks yet</h3>
        <p className="text-gray-400 mb-6">You haven't bookmarked any articles yet. Browse our blogs and save your favorites!</p>
        <Link 
          to="/blogs" 
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-medium hover:opacity-90 transition-all duration-300 inline-flex items-center gap-2"
        >
          Explore Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <FaBookmark className="text-cyan-400 mr-3" />
        <span>Your Bookmarked Articles</span>
        <span className="ml-3 text-sm bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
          {bookmarks.length}
        </span>
      </h2>
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {bookmarks.map(blog => (
          <motion.div
            key={blog._id}
            variants={fadeInUp}
            className="bg-gray-800/70 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700/50"
          >
            <Link to={`/blog/${blog._id}`} className="block">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={`http://localhost:5000${blog.coverImage}`} 
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveBookmark(blog._id);
                  }}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
                >
                  <FaBookmark className="text-cyan-400" />
                </button>
              </div>
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">
                    {blog.category}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto flex items-center">
                    <FaEye className="mr-1" /> {blog.viewCount || 0}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{blog.readTime} read</span>
                  <span className="text-cyan-400 text-sm font-medium">Read more →</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default BookmarkedBlogs;
