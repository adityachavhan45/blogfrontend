import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 50,
      damping: 12
    }
  }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3
    }
  }
}

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [featuredBlog, setFeaturedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
    
    // Add parallax effect on scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const decorElements = document.querySelectorAll('.decor-element');
      decorElements.forEach((element, index) => {
        const speed = index * 0.05 + 0.1;
        element.style.transform = `translateY(${scrollPosition * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    // Restore scroll position if coming back from blog detail
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
        sessionStorage.removeItem('scrollPosition'); // Clear after use
      }, 100); // Small delay to ensure content is rendered
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs');
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();
      
      // Set featured blog (most recent)
      if (data.length > 0) {
        // Sort by date and get the latest
        const sortedBlogs = [...data].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setFeaturedBlog(sortedBlogs[0]);
      }
      
      setBlogs(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(blog => blog.category))];
      setCategories(['All', ...uniqueCategories]);
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  

  
  // Filter blogs based on category
  const filteredBlogs = blogs
    .filter(blog => activeCategory === 'All' || blog.category === activeCategory)
    // Remove featured blog from the list if it exists
    .filter(blog => featuredBlog ? blog._id !== featuredBlog._id : true);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-r-2 border-transparent border-t-cyan-500 animate-spin"></div>
            <div className="absolute inset-1 rounded-full border-b-2 border-l-2 border-r-2 border-transparent border-b-purple-500 animate-spin animation-delay-150"></div>
            <div className="absolute inset-2 rounded-full border-t-2 border-l-2 border-transparent border-l-pink-500 animate-spin animation-delay-300"></div>
            <div className="absolute inset-3 rounded-full border-b-2 border-transparent border-r-amber-500 animate-spin animation-delay-500"></div>
          </div>
          <div className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-xl font-bold">Loading content...</div>
          <div className="text-gray-500 text-sm animate-pulse">Preparing articles for you</div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-[#1a1d25]/80 backdrop-blur-lg p-8 rounded-2xl border border-red-500/20 max-w-md"
        >
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // No blogs state
  if (blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-[#1a1d25]/80 backdrop-blur-lg p-8 rounded-2xl border border-gray-800 max-w-md"
        >
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-purple-500/10 mb-4">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No content yet</h3>
          <p className="text-gray-400">We're working on creating amazing content for you. Check back soon!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse decor-element"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px] animate-pulse delay-700 decor-element"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-blue-500/5 rounded-full blur-[140px] animate-pulse delay-1000 decor-element"></div>
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] animate-pulse delay-500 decor-element"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            <span className="inline-block bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Explore Our Journal
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-medium">
            Insights, tutorials and stories from the cutting edge of technology
          </p>
        </motion.div>
        

        
        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category 
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/20' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300 hover:shadow-md'}`}
            >
              {category}
            </button>
          ))}
        </motion.div>
        
        {/* Featured Blog */}
        {featuredBlog && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full mr-3"></span>
              Featured Article
            </h2>
            <Link 
              to={`/blog/${featuredBlog._id}`} 
              className="block group"
              onClick={() => {
                // Store current scroll position before navigating to blog detail
                sessionStorage.removeItem('scrollPosition');
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-[#1a1d25]/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/5 p-0 md:p-0">
                {featuredBlog.coverImage && (
                  <div className="md:col-span-5 h-64 md:h-auto relative overflow-hidden">
                    <img
                      src={`http://localhost:5000${featuredBlog.coverImage}`}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117]/80 via-transparent to-transparent md:bg-gradient-to-l md:from-[#0f1117]/80 md:via-transparent md:to-transparent"></div>
                  </div>
                )}
                <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow">
                        {featuredBlog.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(featuredBlog.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 transition-all duration-300">
                      {featuredBlog.title}
                    </h3>
                    <p className="text-gray-400 mb-6 line-clamp-2">
                      {featuredBlog.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-purple-400 group-hover:text-cyan-400 transition-colors duration-300">
                      <span className="text-sm font-medium">Read article</span>
                      <svg className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs text-gray-500">{featuredBlog.readTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Blog Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <motion.div 
                key={blog._id}
                variants={fadeInUp}
                className="h-full"
              >
                <Link 
                  to={`/blog/${blog._id}`} 
                  className="block h-full group"
                  onClick={() => {
                    // Store current scroll position before navigating to blog detail
                    sessionStorage.removeItem('scrollPosition');
                  }}
                >
                  <article className="flex flex-col h-full bg-[#1a1d25]/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/5 p-6">
                    {/* Blog Cover Image - Optional */}
                    {blog.coverImage && (
                      <div className="h-48 -mx-6 -mt-6 mb-6 overflow-hidden relative">
                        <img
                          src={`http://localhost:5000${blog.coverImage}`}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d25] via-transparent to-transparent"></div>
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/20">
                            {blog.category}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Category Badge - Show only if no cover image */}
                    {!blog.coverImage && (
                      <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/20">
                          {blog.category}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex flex-col flex-grow">
                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 transition-all duration-300">
                        {blog.title}
                      </h2>
                      
                      <p className="text-gray-400 mb-4 text-sm line-clamp-2 flex-grow">
                        {blog.excerpt}
                      </p>
                      
                      {/* Tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                          {blog.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{blog.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-800/30 mt-auto">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-gray-500">
                            {new Date(blog.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-purple-400 group-hover:text-cyan-400 transition-colors duration-300">
                          <span className="text-xs font-medium">{blog.readTime} min read</span>
                          <svg className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div 
              variants={fadeIn}
              className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16"
            >
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-purple-500/10 mb-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                We couldn't find any articles in the "{activeCategory}" category. Try selecting a different category.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}