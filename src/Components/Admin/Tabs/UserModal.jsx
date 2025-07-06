import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const UserModal = ({ isOpen, onClose, user, onSubmit }) => {
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        status: 'active'
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                password: '',
                status: user.status || 'active'
            });
        } else {
            setFormData({
                username: '',
                email: '',
                password: '',
                status: 'active'
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1f2937] rounded-lg p-6 w-full max-w-md relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <FaTimes />
                </button>
                
                <h2 className="text-xl font-semibold text-gray-200 mb-6">
                    {user ? 'Edit User' : 'Add New User'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-[#2d3748] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-[#e052a0] transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-[#2d3748] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-[#e052a0] transition-colors"
                        />
                    </div>

                    {user ? (
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-400">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                                    className="text-sm text-[#e052a0] hover:text-[#f15c41] transition-colors"
                                >
                                    {showPasswordChange ? 'Cancel' : 'Change Password'}
                                </button>
                            </div>
                            {showPasswordChange && (
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    className="w-full px-3 py-2 bg-[#2d3748] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-[#e052a0] transition-colors"
                                />
                            )}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!user}
                                className="w-full px-3 py-2 bg-[#2d3748] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-[#e052a0] transition-colors"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-[#2d3748] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-[#e052a0] transition-colors"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium rounded-lg text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#e052a0] to-[#f15c41] hover:from-[#d0408f] hover:to-[#e04d32] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {user ? 'Update User' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
