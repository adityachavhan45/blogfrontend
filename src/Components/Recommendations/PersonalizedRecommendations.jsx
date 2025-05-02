import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

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

const PersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = '/api/recommendations/trending';
      let headers = {};
      
      // If user is logged in, fetch personalized recommendations
      if (token) {
        url = '/api/recommendations/personalized';
        headers = {
          'Authorization': `Bearer ${token}`
        };
      }
      
      const response = await fetch(`http://localhost:5000${url}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      const data = await response.json();
      setRecommendations(data);
      
      // If user is logged in, fetch bookmark status
      if (token) {
        fetchBookmarkStatus(data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to load recommendations. Please try again later.');
      setLoading(false);
    }
  };

  const fetchBookmarkStatus = async (blogs) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const bookmarkedSet = new Set();
      
      // For each blog, check if it's bookmarked
      for (const blog of blogs) {
        const response = await fetch(`http://localhost:5000/api/interactions/blogs/${blog._id}/interaction`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.isBookmarked) {
            bookmarkedSet.add(blog._id);
          }
        }
      }
      
      setBookmarkedBlogs(bookmarkedSet);
    } catch (error) {
      console.error('Error fetching bookmark status:', error);
    }
  };

  const handleToggleBookmark = async (blogId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      window.location.href = '/login';
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/interactions/blogs/${blogId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        setBookmarkedBlogs(prev => {
          const newSet = new Set(prev);
          if (data.bookmarked) {
            newSet.add(blogId);
          } else {
            newSet.delete(blogId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
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
          onClick={fetchRecommendations}
          className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No recommendations available at this time.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {recommendations.map(blog => (
        <motion.div
          key={blog._id}
          variants={fadeInUp}
          className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]"
        >
          <Link to={`/blog/${blog._id}`} className="block">
            {blog.coverImage ? (
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={`http://localhost:5000${blog.coverImage}`} 
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    // Hide the image container if image fails to load
                    e.target.parentNode.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <button
                  onClick={(e) => handleToggleBookmark(blog._id, e)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
                >
                  {bookmarkedBlogs.has(blog._id) ? (
                    <FaBookmark className="text-cyan-400" />
                  ) : (
                    <FaRegBookmark />
                  )}
                </button>
              </div>
            ) : (
              <div className="relative h-24 bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
                <button
                  onClick={(e) => handleToggleBookmark(blog._id, e)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
                >
                  {bookmarkedBlogs.has(blog._id) ? (
                    <FaBookmark className="text-cyan-400 text-sm" />
                  ) : (
                    <FaRegBookmark className="text-sm" />
                  )}
                </button>
                <div className="text-sm text-gray-400 font-medium">{blog.category}</div>
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center mb-3">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">
                  {blog.category}
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  {new Date(blog.createdAt).toLocaleDateString()}
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
  );
};

export default PersonalizedRecommendations;
