import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaUserShield } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/admin/login', formData);
            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token);
                navigate('/admin/dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-6 bg-[#1a1d25] p-8 rounded-lg shadow-xl">
                <div>
                    <h2 className="text-center text-3xl font-bold">
                        <span className="text-[#e052a0]">Welcome</span> <span className="text-[#f15c41]">Back</span>
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Sign in to access your account
                    </p>
                </div>
                
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm" 
                        role="alert">
                        <p>{error}</p>
                    </motion.div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none relative block w-full px-3 py-3 pl-10 bg-[#272a31] border border-gray-700 placeholder-gray-500 text-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-[#e052a0] focus:border-[#e052a0] focus:z-10 sm:text-sm transition-all duration-200"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 pl-10 bg-[#272a31] border border-gray-700 placeholder-gray-500 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e052a0] focus:border-[#e052a0] focus:z-10 sm:text-sm transition-all duration-200"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#e052a0] to-[#f15c41] hover:from-[#d0408f] hover:to-[#e04d32] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e052a0] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                        >
                            Sign in to Dashboard
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
