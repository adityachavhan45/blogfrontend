import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './custom-quill.css'; // Import custom styles for the editor
import { motion } from 'framer-motion';
import { FaImage, FaTags, FaClock, FaFolder, FaSearch } from 'react-icons/fa';
import KeywordSuggestions from './KeywordSuggestions';
import SEOChecklist from '../SEOChecklist';

const AddBlog = () => {
  // Prevent multiple submissions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    readTime: '',
    tags: [],
    coverImage: null,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    focusKeyword: ''
  });
  const [error, setError] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  // State to control editor visibility
  const [editorVisible, setEditorVisible] = useState(false);
  
  // Show editor after a small delay to ensure toolbar positioning
  useEffect(() => {
    const timer = setTimeout(() => {
      setEditorVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        coverImage: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If a submission is already in progress, do nothing
    if (isSubmitting) return;

    setIsSubmitting(true);
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('You must be logged in to create blogs');
        return;
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'coverImage') {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/blogs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to save blog');
        return;
      }

      navigate('/admin/dashboard');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error saving blog:', error);
      setIsSubmitting(false);
      setError('Failed to save blog. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-[#1a1d25] rounded-lg shadow-xl p-6 space-y-8 relative"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Create New Blog</h2>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 text-sm rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-500 bg-red-100/10 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-[#272a31] text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e052a0] focus:border-transparent"
              required
            />
          </div>

          {/* Excerpt Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Excerpt
            </label>
            <input
              type="text"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-[#272a31] text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e052a0] focus:border-transparent"
              required
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Content
            </label>
            <div className="prose prose-invert max-w-none">
              {editorVisible ? (
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  className="bg-[#272a31] rounded-lg text-gray-200 custom-quill-editor"
                  modules={{
                    toolbar: {
                      container: [
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ align: [] }], // Add alignment options
                        [{ indent: '-1' }, { indent: '+1' }], // Add indentation options
                        ['link', 'image', 'code-block'],
                        [{ color: [] }, { background: [] }], // Add color options
                        ['clean']
                      ],
                      handlers: {}
                    }
                  }}
                />
              ) : (
                <div className="bg-[#272a31] rounded-lg text-gray-200 h-[300px] flex items-center justify-center">
                  <span className="text-gray-500">Loading editor...</span>
                </div>
              )}
            </div>
          </div>

          {/* Category and Read Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                <FaFolder className="inline mr-2" />
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[#272a31] text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e052a0] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                <FaClock className="inline mr-2" />
                Read Time
              </label>
              <input
                type="text"
                name="readTime"
                value={formData.readTime}
                onChange={handleInputChange}
                placeholder="e.g., 5 min read"
                className="w-full px-4 py-2 bg-[#272a31] text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e052a0] focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              <FaTags className="inline mr-2" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#e052a0] text-white"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                className="flex-1 px-4 py-2 bg-[#272a31] text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e052a0] focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 text-white bg-[#e052a0] rounded-lg hover:bg-[#d0408f] transition-colors"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              <FaImage className="inline mr-2" />
              Cover Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-48 w-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, coverImage: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >

                    </button>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <FaImage className="mx-auto h-12 w-12 mb-3" />
                    <p className="text-sm">
                      Drag and drop an image, or click to select
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                  id="coverImage"
                />
                <label
                  htmlFor="coverImage"
                  className="relative cursor-pointer rounded-md font-medium text-[#e052a0] hover:text-[#d0408f] focus-within:outline-none"
                >
                  <span>Upload a file</span>
                </label>
              </div>
            </div>
          </div>

          {/* SEO Optimization Section */}
          <div className="mt-8 border-t border-gray-800 pt-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FaSearch className="mr-2 text-[#e052a0]" />
              SEO Optimization
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Optimize your blog post for search engines to increase visibility and traffic.
            </p>

            {/* Keyword Suggestions */}
            <KeywordSuggestions 
              title={formData.title} 
              content={formData.content}
              onSelectKeyword={(keywords) => {
                setFormData(prev => ({
                  ...prev,
                  seoKeywords: keywords,
                  tags: [...new Set([...prev.tags, ...keywords])]
                }));
              }} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  SEO Title (For search engines)
                </label>
                <input
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle || formData.title}
                  onChange={handleInputChange}
                  placeholder="Optimized title for search engines"
                  className="w-full px-4 py-2 bg-[#272a31] text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e052a0] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {(formData.seoTitle || formData.title).length}/60 characters
                  {(formData.seoTitle || formData.title).length > 60 && (
                    <span className="text-red-400"> (Too long)</span>
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Focus Keyword
                </label>
                <input
                  type="text"
                  name="focusKeyword"
                  value={formData.focusKeyword}
                  onChange={handleInputChange}
                  placeholder="Main keyword to rank for"
                  className="w-full px-4 py-2 bg-[#272a31] text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e052a0] focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Meta Description
              </label>
              <textarea
                name="seoDescription"
                value={formData.seoDescription || formData.excerpt}
                onChange={handleInputChange}
                placeholder="Brief description for search results (150-160 characters ideal)"
                rows="3"
                className="w-full px-4 py-2 bg-[#272a31] text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e052a0] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {(formData.seoDescription || formData.excerpt).length}/160 characters
                {(formData.seoDescription || formData.excerpt).length > 160 && (
                  <span className="text-red-400"> (Too long)</span>
                )}
              </p>
            </div>

            <div className="mt-4 bg-gray-800/30 p-4 rounded-lg">
              <h4 className="font-medium text-white mb-2">SEO Preview</h4>
              <div className="bg-white p-3 rounded">
                <p className="text-blue-600 text-lg font-medium truncate">
                  {formData.seoTitle || formData.title || 'Blog Title'}
                </p>
                <p className="text-green-700 text-sm">
                  {window.location.origin}/blogs/{formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}
                </p>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {formData.seoDescription || formData.excerpt || 'Blog description will appear here...'}
                </p>
              </div>
            </div>
            
            {/* SEO Checklist */}
            <SEOChecklist
              title={formData.title}
              content={formData.content}
              focusKeyword={formData.focusKeyword}
              seoTitle={formData.seoTitle}
              seoDescription={formData.seoDescription}
              tags={formData.tags}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-3 text-sm font-medium rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 text-sm font-medium rounded-lg text-white transition-all duration-200 transform ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-[#e052a0] to-[#f15c41] hover:from-[#d0408f] hover:to-[#e04d32] hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Blog'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddBlog;

