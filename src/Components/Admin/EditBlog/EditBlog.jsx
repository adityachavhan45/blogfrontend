import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './custom-quill.css'; // Import custom styles for the editor

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    readTime: ''
  });

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/blogs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch blog');
      const data = await response.json();
      setFormData({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        readTime: data.readTime
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to fetch blog details');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate required fields
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category || !formData.readTime) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Admin authentication required');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          readTime: formData.readTime
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update blog');
      }
      
      // Show success message and redirect
      alert('Blog updated successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error updating blog:', error);
      setError(error.message || 'Failed to update blog. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Admin authentication required');
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/blogs/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to delete blog');
        }

        alert('Blog deleted successfully!');
        navigate('/admin/dashboard');
      } catch (error) {
        console.error('Error deleting blog:', error);
        setError(error.message || 'Failed to delete blog. Please try again.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400 mt-8">Loading blog details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-200 mb-6">Edit Blog</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-[#1f2937] text-gray-200 border border-gray-700 focus:outline-none focus:border-[#e052a0]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Excerpt</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 rounded-lg bg-[#1f2937] text-gray-200 border border-gray-700 focus:outline-none focus:border-[#e052a0]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
          <div className="prose prose-invert max-w-none">
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
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-[#1f2937] text-gray-200 border border-gray-700 focus:outline-none focus:border-[#e052a0]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Read Time (in minutes)</label>
            <input
              type="text"
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-[#1f2937] text-gray-200 border border-gray-700 focus:outline-none focus:border-[#e052a0]"
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 border-t border-gray-700 pt-6">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                      text-red-300 bg-red-900/30 hover:bg-red-900/50 hover:text-white
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                      flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Delete Blog</span>
          </button>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                        text-gray-300 bg-gray-700 hover:bg-gray-600 hover:text-white
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                        flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
            
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                        text-white bg-gradient-to-r from-indigo-500 to-purple-600
                        hover:from-indigo-600 hover:to-purple-700
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                        flex items-center space-x-2 shadow-lg hover:shadow-indigo-500/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Update Blog</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
