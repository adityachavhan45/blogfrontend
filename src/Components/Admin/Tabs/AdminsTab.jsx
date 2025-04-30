import React, { useState, useEffect } from 'react';
import { FaUserShield, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import UserModal from './UserModal';

const AdminsTab = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/admin/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setAdmins(data.admins);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to fetch admins');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (adminData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/admin/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(adminData)
            });
            const data = await response.json();
            
            if (data.success) {
                setAdmins([...admins, data.admin]);
                setShowAddModal(false);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to add admin');
        }
    };

    const handleEdit = async (adminData) => {
        try {
            const token = localStorage.getItem('adminToken');
            let response;

            // If password is provided, update password first
            if (adminData.password) {
                response = await fetch(`http://localhost:5000/api/admin/${selectedAdmin._id}/password`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ newPassword: adminData.password })
                });
                const passwordData = await response.json();
                if (!passwordData.success) {
                    setError(passwordData.message);
                    return;
                }
            }

            // Update other admin details
            const { password, ...adminDetails } = adminData;
            response = await fetch(`http://localhost:5000/api/admin/${selectedAdmin._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(adminDetails)
            });
            const data = await response.json();
            
            if (data.success) {
                setAdmins(admins.map(admin => 
                    admin._id === selectedAdmin._id ? data.admin : admin
                ));
                setShowEditModal(false);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to update admin');
        }
    };

    const handleDelete = async (adminId) => {
        if (!window.confirm('Are you sure you want to delete this admin?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/admin/${adminId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setAdmins(admins.filter(admin => admin._id !== adminId));
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to delete admin');
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
        <h2 className="text-xl font-semibold text-gray-200">Manage Admins</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#e052a0] to-[#f15c41] hover:from-[#d0408f] hover:to-[#e04d32] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <FaPlus className="mr-2" />
          Add Admin
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {admins.map(admin => (
                <tr key={admin._id} className="hover:bg-[#2d3748] transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-200">{admin.username}</td>
                  <td className="px-6 py-4 text-sm text-gray-200">{admin.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-200">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-3">
                    <button 
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setShowEditModal(true);
                      }}
                      className="text-[#e052a0] hover:text-[#f15c41] transition-colors"
                    >
                      <FaEdit className="inline-block" />
                    </button>
                    <button 
                      onClick={() => handleDelete(admin._id)}
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

      {/* Add Admin Modal */}
      <UserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
      />

      {/* Edit Admin Modal */}
      <UserModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={selectedAdmin}
        onSubmit={handleEdit}
      />
    </div>
  );
};

export default AdminsTab;
