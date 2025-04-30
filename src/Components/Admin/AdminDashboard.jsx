import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBlog, FaUserShield, FaUsers } from 'react-icons/fa';
import BlogsTab from './Tabs/BlogsTab';
import AdminsTab from './Tabs/AdminsTab';
import UsersTab from './Tabs/UsersTab';

const AdminDashboard = () => {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('blogs');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        const fetchAdminData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAdminData(response.data.admin);
                setLoading(false);
            } catch (error) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            }
        };

        fetchAdminData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e052a0]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1117]">
            {/* Navigation Bar */}
            <nav className="bg-[#0f1117] border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-semibold text-[#e052a0]">Solution</span>
                            <span className="text-2xl font-semibold text-white">Blog</span>
                        </div>
                        <div className="flex items-center space-x-4">

                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#e052a0] to-[#f15c41] hover:from-[#d0408f] hover:to-[#e04d32] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <FaSignOutAlt className="inline-block mr-2" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Admin Info Card */}
                    <div className="bg-[#171923] rounded-lg p-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#e052a0] to-[#f15c41] flex items-center justify-center text-white text-2xl font-semibold">
                                    {adminData?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-1">
                                        Welcome back, {adminData?.username}!
                                    </h2>
                                    <p className="text-gray-400">{adminData?.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-400 mb-1">Last login</div>
                                <div className="text-white">{new Date().toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                    {/* Tabs */}
                    <div className="border-b border-gray-700 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('blogs')}
                                className={`flex items-center py-4 px-1 border-b-2 text-sm font-medium ${activeTab === 'blogs' 
                                    ? 'border-[#e052a0] text-[#e052a0]' 
                                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
                            >
                                <FaBlog className="mr-2" />
                                Blogs
                            </button>

                            <button
                                onClick={() => setActiveTab('admins')}
                                className={`flex items-center py-4 px-1 border-b-2 text-sm font-medium ${activeTab === 'admins' 
                                    ? 'border-[#e052a0] text-[#e052a0]' 
                                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
                            >
                                <FaUserShield className="mr-2" />
                                Admins
                            </button>

                            <button
                                onClick={() => setActiveTab('users')}
                                className={`flex items-center py-4 px-1 border-b-2 text-sm font-medium ${activeTab === 'users' 
                                    ? 'border-[#e052a0] text-[#e052a0]' 
                                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
                            >
                                <FaUsers className="mr-2" />
                                Users
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-[#171923] rounded-lg p-6">
                        {activeTab === 'blogs' && <BlogsTab />}
                        {activeTab === 'admins' && <AdminsTab />}
                        {activeTab === 'users' && <UsersTab />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
