import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const RelatedBlogs = ({ blogId }) => {
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blogId) {
      fetchRelatedBlogs();
    }
  }, [blogId]);

  const fetchRelatedBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/blogs/${blogId}/related`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch related blogs');
      }
      
      const data = await response.json();
      setRelatedBlogs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching related blogs:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (relatedBlogs.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Related Articles
        </span>
        <div className="h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent ml-4"></div>
      </h3>
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col space-y-2"
      >
        {relatedBlogs.map(blog => (
          <motion.div
            key={blog._id}
            variants={fadeInUp}
            className="group"
          >
            <Link 
              to={`/blog/${blog._id}`}
              onClick={() => {
                // Store current scroll position in sessionStorage before navigating
                sessionStorage.setItem('scrollPosition', window.scrollY.toString());
              }}
              className="flex items-center text-white hover:text-cyan-400 transition-colors py-1"
            >
              <span className="mr-2 text-cyan-500">•</span>
              <h4 className="font-medium">{blog.title}</h4>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RelatedBlogs;
