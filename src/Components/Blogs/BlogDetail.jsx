import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import { FaUser, FaComment, FaPaperPlane, FaLock, FaBookmark, FaRegBookmark, FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';
import './quill-content.css'; // Import the CSS for ReactQuill content
import ReadingTracker from './ReadingTracker';
import BlogSummary from './BlogSummary';
import RelatedBlogs from './RelatedBlogs';
import { updateBlogMetaTags } from '../../utils/seoUtils.jsx';
import { injectBlogStructuredData } from '../../utils/structuredDataUtils';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentForm, setCommentForm] = useState({
    content: ''
  });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const contentRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlog();
    fetchComments();
    checkLoginStatus();
    // Add a class to the body to prevent background color issues
    document.body.classList.add('bg-[#0f1117]');
    // Only scroll to top when the blog ID changes
    window.scrollTo(0, 0);
    
    return () => {
      document.body.classList.remove('bg-[#0f1117]');
      // Reset title when component unmounts
      document.title = 'LikhoVerse - Your Knowledge Hub';
    };
  }, [id]);
  
  // Check interaction status when user is logged in and blog is loaded
  useEffect(() => {
    if (isLoggedIn && blog) {
      checkInteractionStatus();
    }
  }, [isLoggedIn, blog, id]);
  
  // Effect to measure content height after blog loads
  useEffect(() => {
    if (blog && contentRef.current) {
      // Use a small delay to ensure content is fully rendered
      const timer = setTimeout(() => {
        const height = contentRef.current.scrollHeight;
        setContentHeight(height);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [blog]);
  
  // Inject JSON-LD structured data when blog data is loaded
  useEffect(() => {
    if (blog) {
      injectBlogStructuredData(blog);
    }
  }, [blog]);
  
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };
  
  const checkInteractionStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interactions/blogs/${id}/interaction`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.isBookmarked);
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error('Error checking interaction status:', error);
    }
  };
  
  const handleToggleBookmark = async () => {
    if (!isLoggedIn) {
      handleLoginRedirect();
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interactions/blogs/${id}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.bookmarked);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };
  
  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      handleLoginRedirect();
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interactions/blogs/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const fetchBlog = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`);
      if (!response.ok) throw new Error('Blog not found');
      const data = await response.json();
      setBlog(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/blog/${id}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
      setLoadingComments(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoadingComments(false);
    }
  };

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setCommentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError(null);
    setSubmittingComment(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to comment');
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          blogId: id,
          content: commentForm.content
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit comment');
      }
      
      const newComment = await response.json();
      setComments(prev => [newComment, ...prev]);
      setCommentForm({
        content: ''
      });
      setSubmittingComment(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setCommentError(error.message);
      setSubmittingComment(false);
    }
  };
  
  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: `/blogs/${id}` } });
  };

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
          <div className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-xl font-bold">Loading article...</div>
          <div className="text-gray-500 text-sm animate-pulse">Please wait a moment</div>
        </motion.div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-[#1a1d25]/80 backdrop-blur-lg p-8 rounded-2xl border border-red-500/20 max-w-md"
        >SEO for your SolutionBlog project, similar to how it would work in a 
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Article not found</h3>
          <p className="text-gray-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/blogs" 
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to blogs
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {blog && updateBlogMetaTags(blog)}
      {/* Invisible component to track reading activity */}
      {blog && <ReadingTracker blogId={id} />}
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-blue-500/5 rounded-full blur-[140px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] animate-pulse delay-500"></div>
      </div>
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto relative z-10"
      >
        {/* Back button */}
        <motion.div variants={fadeIn} className="mb-8">
          <Link 
            to="/blogs" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors duration-300 group"
            onClick={(e) => {
              // Store current scroll position in sessionStorage before navigating
              sessionStorage.setItem('scrollPosition', window.scrollY.toString());
            }}
          >
            <svg className="w-5 h-5 transform transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Back to all articles</span>
          </Link>
        </motion.div>
        
        <article className="space-y-8">
          {/* Category Badge */}
          <motion.div variants={fadeIn} className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
              {blog.category}
            </span>
          </motion.div>
          
          {/* Title */}
          <motion.h1 
            variants={fadeIn} 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300"
          >
            {blog.title}
          </motion.h1>
                    {/* Meta Info */}
          <motion.div 
            variants={fadeIn} 
            className="flex flex-wrap items-center gap-6 text-sm border-b border-gray-800/30 pb-6"
          >
            {/* Author Info */}
            {blog.author && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white">
                  <FaUser className="w-3 h-3" />
                </div>
                <span className="font-medium text-white">{blog.author.username}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{blog.readTime} read</span>
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
              <button 
                onClick={handleToggleLike}
                className="flex items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors"
              >
                {isLiked ? (
                  <FaThumbsUp className="text-pink-500" />
                ) : (
                  <FaRegThumbsUp />
                )}
              </button>
              
              <button 
                onClick={handleToggleBookmark}
                className="flex items-center gap-1 text-gray-400 hover:text-cyan-500 transition-colors"
              >
                {isBookmarked ? (
                  <FaBookmark className="text-cyan-500" />
                ) : (
                  <FaRegBookmark />
                )}
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400">
              <FaComment className="w-4 h-4 text-gray-500" />
              <span>{comments.length} comments</span>
            </div>
            
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-gray-400 text-sm bg-gray-800/30 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
          
          {/* Cover Image */}
          {blog.coverImage && (
            <motion.div 
              variants={fadeIn}
              className="relative rounded-2xl overflow-hidden bg-[#1a1d25]/60 shadow-xl border border-gray-800/50 my-8 group hover:shadow-purple-500/10 transition-all duration-500"
            >
              <img
                src={`${import.meta.env.VITE_API_URL}${blog.coverImage}`}
                alt={blog.title}
                onClick={() => setShowImageModal(true)}
                className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700 cursor-zoom-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117]/80 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6" />
                </svg>
              </div>
            </motion.div>
          )}
          
          {/* Content */}
          <motion.div 
            variants={fadeIn}
            className="bg-[#1a1d25]/60 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-2xl border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300"
          >
            {/* AI-generated blog summary */}
            {blog && <BlogSummary blogId={id} />}
            
            <div className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-white prose-p:leading-relaxed prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-cyan-500 prose-blockquote:bg-gray-800/30 prose-blockquote:py-0.5 prose-blockquote:px-4 prose-blockquote:rounded-r-md prose-img:rounded-lg prose-img:shadow-lg text-white [&_*]:text-white quill-content">
              <div
                ref={contentRef}
                className={!isContentExpanded && contentHeight > 500 ? 'max-h-[500px] overflow-hidden relative' : ''}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(blog.content),
                }}
              />
              
              {!isContentExpanded && contentHeight > 500 && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px' }} className="bg-gradient-to-t from-[#1a1d25] to-transparent pointer-events-none"></div>
              )}
            </div>
            
            {contentHeight > 500 && (
              <div className="mt-6 text-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // Store current scroll position
                    const currentScrollPos = window.scrollY;
                    const wasExpanded = isContentExpanded;
                    
                    // Update state
                    setIsContentExpanded(!wasExpanded);
                    
                    // Use setTimeout to maintain scroll position after state update
                    setTimeout(() => {
                      // When collapsing, we need to adjust for the reduced content height
                      if (wasExpanded) {
                        // Get the button's position to scroll to it
                        const buttonElement = e.currentTarget;
                        const buttonRect = buttonElement.getBoundingClientRect();
                        const targetScrollPosition = window.scrollY + buttonRect.top - 200; // Position button in view
                        window.scrollTo({
                          top: targetScrollPosition,
                          behavior: 'smooth'
                        });
                      } else {
                        // When expanding, maintain current position
                        window.scrollTo(0, currentScrollPos);
                      }
                    }, 10);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-medium hover:opacity-90 transition-all duration-300 inline-flex items-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:translate-y-[-2px]"
                >
                  {isContentExpanded ? (
                    <>
                      <span>Show Less</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Read More</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7m-7 7h18" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
          
          {/* Comments Section */}
          <motion.div variants={fadeIn} className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-6">Comments ({comments.length})</h3>
            
            {/* Comment Form */}
            <div className="bg-[#1a1d25]/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-gray-800/50 mb-8">
              <h4 className="text-xl font-semibold text-white mb-4">Leave a Comment</h4>
              
              {isLoggedIn ? (
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  {commentError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                      {commentError}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-1">Comment</label>
                    <textarea
                      id="content"
                      name="content"
                      value={commentForm.content}
                      onChange={handleCommentChange}
                      rows="4"
                      className="w-full px-4 py-2 bg-[#272a31] text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-medium hover:opacity-90 transition-all duration-300 inline-flex items-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{submittingComment ? 'Submitting...' : 'Post Comment'}</span>
                      <FaPaperPlane className="w-3 h-3" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-[#272a31]/80 rounded-lg p-6 text-center">
                  <FaLock className="w-8 h-8 mx-auto text-gray-500 mb-3" />
                  <h5 className="text-white font-medium mb-2">Login Required</h5>
                  <p className="text-gray-400 mb-4">You need to be logged in to post a comment.</p>
                  <button
                    onClick={handleLoginRedirect}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-medium hover:opacity-90 transition-all duration-300 inline-flex items-center gap-2"
                  >
                    <span>Login to Comment</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            {/* Comments List */}
            <div className="space-y-6">
              {loadingComments ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-2 border-gray-600 border-t-cyan-500 rounded-full animate-spin"></div>
                  <p className="mt-2 text-gray-400">Loading comments...</p>
                </div>
              ) : comments.length > 0 ? (
                comments.map(comment => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#1a1d25]/40 backdrop-blur-sm rounded-xl p-5 border border-gray-800/30 hover:border-gray-700/50 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500/80 to-purple-500/80 flex items-center justify-center text-white flex-shrink-0">
                        {comment.user && comment.user.username ? comment.user.username.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-center mb-2">
                          <h4 className="text-white font-medium">{comment.user ? comment.user.username : 'Anonymous'}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-300">{comment.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 bg-[#1a1d25]/30 rounded-xl border border-gray-800/30">
                  <FaComment className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                  <p className="text-gray-400">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Related blogs section */}
          <motion.div 
            variants={fadeIn}
            className="pt-8 mt-12 border-t border-gray-800/30"
          >
            {blog && <RelatedBlogs blogId={id} />}
          </motion.div>
        </article>
      </motion.div>
      
      {/* Image Modal */}
      {showImageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setShowImageModal(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative max-w-6xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black transition-colors z-10 shadow-lg"
              onClick={() => setShowImageModal(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={`${import.meta.env.VITE_API_URL}${blog.coverImage}`}
              alt={blog.title}
              className="max-w-full max-h-[85vh] object-contain mx-auto rounded-xl shadow-2xl border border-gray-800/30"
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BlogDetail;
