import React, { useState, useEffect } from 'react';
import { FaBlog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BlogsTab = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    readTime: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/blogs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
    }
  };


  const handleEdit = (blog) => {
    navigate(`/admin/blogs/edit/${blog._id}`);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete blog');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading blogs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-200">Manage Blogs</h2>
        <button
          onClick={() => navigate('/admin/blogs/add')}
          className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#e052a0] to-[#f15c41] hover:from-[#d0408f] hover:to-[#e04d32] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Add New Blog
        </button>
      </div>

      <div className="bg-[#1f2937] rounded-lg p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Read Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-[#2d3748] transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-200">{blog.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-200">{blog.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-200">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-200">{blog.readTime}</td>
                  <td className="px-6 py-4 text-sm text-gray-200">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="text-[#e052a0] hover:text-[#f15c41] mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blog Form Modal */}

    </div>
  );
};

export default BlogsTab;
