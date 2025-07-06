import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import UserModal from './UserModal';

const UsersTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setUsers(data.users);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (userData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            
            if (data.success) {
                setUsers([...users, data.user]);
                setShowAddModal(false);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to add user');
        }
    };

    const handleEdit = async (userData) => {
        try {
            const token = localStorage.getItem('adminToken');
            let response;

            // If password is provided, update password first
            if (userData.password) {
                response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${selectedUser._id}/password`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ newPassword: userData.password })
                });
                const passwordData = await response.json();
                if (!passwordData.success) {
                    setError(passwordData.message);
                    return;
                }
            }

            // Update other user details
            const { password, ...userDetails } = userData;
            response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${selectedUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userDetails)
            });
            const data = await response.json();
            
            if (data.success) {
                setUsers(users.map(user => 
                    user._id === selectedUser._id ? data.user : user
                ));
                setShowEditModal(false);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to update user');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setUsers(users.filter(user => user._id !== userId));
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e052a0]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center py-4">{error}</div>
        );
    }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-200">Manage Users</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#e052a0] to-[#f15c41] hover:from-[#d0408f] hover:to-[#e04d32] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <FaPlus className="mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-[#1f2937] rounded-lg p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-[#2d3748] transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-200">{user.username}</td>
                  <td className="px-6 py-4 text-sm text-gray-200">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-200">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'active' 
                      ? 'bg-green-900 text-green-300'
                      : 'bg-red-900 text-red-300'}`}
                    >
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-3">
                    <button 
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                      }}
                      className="text-[#e052a0] hover:text-[#f15c41] transition-colors"
                    >
                      <FaEdit className="inline-block" />
                    </button>
                    <button 
                      onClick={() => handleDelete(user._id)}
                      className="text-red-400 hover:text-red-500 transition-colors"
                    >
                      <FaTrash className="inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Add User Modal */}
      <UserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
      />

      {/* Edit User Modal */}
      <UserModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={selectedUser}
        onSubmit={handleEdit}
      />
    </div>
  );
};

export default UsersTab;
