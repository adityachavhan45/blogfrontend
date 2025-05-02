import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const BlogSummary = ({ blogId }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (blogId) {
      fetchSummary();
    }
  }, [blogId]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/ai/blogs/${blogId}/summary`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }
      
      const data = await response.json();
      setSummary(data.summary);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setError('Could not load AI summary');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-700/50 animate-pulse">
        <div className="flex items-center mb-3">
          <div className="w-6 h-6 rounded-full bg-gray-700"></div>
          <div className="h-4 bg-gray-700 rounded ml-2 w-32"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-700 rounded w-5/6"></div>
          <div className="h-3 bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-xl p-5 mb-6 border border-gray-700/50 shadow-lg"
    >
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <FaRobot className="text-white text-sm" />
          </div>
          <h3 className="ml-3 text-white font-medium">AI Summary</h3>
        </div>
        <button 
          className="w-8 h-8 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-400 hover:bg-gray-700 transition-colors"
        >
          {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
        </button>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 text-gray-300 text-sm leading-relaxed">
              {summary}
            </div>
            <div className="mt-3 text-xs text-gray-500 italic">
              This AI-generated summary is provided to give you a quick overview of the article.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isExpanded && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-2 text-gray-400 text-sm line-clamp-2"
        >
          {summary}
        </motion.div>
      )}
    </motion.div>
  );
};

export default BlogSummary;
