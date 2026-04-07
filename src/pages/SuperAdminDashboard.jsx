import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Users, 
  Trash2, 
  ShieldAlert, 
  UserPlus, 
  UserMinus,
  Mail,
  Loader,
  AlertCircle
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Protection logic: Only superadmin allowed
  useEffect(() => {
    if (!userInfo || userInfo.role !== 'superadmin') {
      navigate('/');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (userInfo && userInfo.role === 'superadmin') {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/users'); 
      console.log('GET /api/users response:', data);
      
      // STEP 1: Handling different backend response formats
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && data.users) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
      setError('Failed to load users. Please check your connection.');
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setProcessingId(id);
        const { data } = await api.delete(`/users/${id}`);
        console.log('DELETE /api/users/:id response:', data);

        // STEP 2: Logic for checking successful deletion
        if (data.message === 'User removed' || data.success) {
          toast.success('User deleted successfully');
          setUsers(currentUsers => currentUsers.filter(u => u._id !== id));
        }
      } catch (err) {
        console.error('Delete user error:', err);
        toast.error(err.response?.data?.message || 'Error deleting user');
      } finally {
        setProcessingId(null);
      }
    }
  };

  const toggleAdminRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      setProcessingId(targetUser._id);
      const { data } = await api.put(`/users/${targetUser._id}/role`, { role: newRole });
      console.log('PUT /api/users/:id/role response:', data);

      // STEP 3: Ensure backend returns updated role
      if (data && (data.role === newRole || data.success)) {
        toast.success(`Role updated to ${newRole}`);
        // Update UI instantly using dynamic state update
        setUsers(currentUsers => 
          currentUsers.map(u => u._id === targetUser._id ? { ...u, role: newRole } : u)
        );
      }
    } catch (err) {
      console.error('Update role error:', err);
      toast.error(err.response?.data?.message || 'Error updating role');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
        <Loader className="text-primary animate-spin mb-3" size={48} />
        <h4 className="text-muted">Loading System Data...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 mt-5 text-center">
        <AlertCircle className="text-danger mb-3" size={64} />
        <h2 className="text-dark font-weight-bold">{error}</h2>
        <button className="btn btn-primary mt-3 px-4 rounded-pill" onClick={fetchUsers}>Retry</button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5 bg-light min-vh-100 mt-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h1 className="display-4 font-weight-bold text-dark mb-2">Super Admin Dashboard</h1>
            <p className="lead text-muted">User Management & Permissions</p>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-lg overflow-hidden" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-white py-4 px-4 border-0 d-flex justify-content-between align-items-center">
                <h3 className="font-weight-bold mb-0 text-primary d-flex align-items-center">
                  <Users className="mr-2" size={28} /> User Management
                </h3>
                <span className="badge badge-primary px-3 py-2 rounded-pill">{users.length} Total Users</span>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light text-muted small text-uppercase font-weight-bold">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="py-3">Email</th>
                        <th className="py-3">Role</th>
                        <th className="text-right px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id}>
                          <td className="px-4 py-3 font-weight-bold text-dark">{user.name}</td>
                          <td className="py-3 text-muted">
                            <Mail size={14} className="mr-1 d-inline" /> {user.email}
                          </td>
                          <td className="py-3">
                            <span className={`badge px-3 py-2 rounded-pill ${
                              user.role === 'superadmin' ? 'badge-danger' : 
                              user.role === 'admin' ? 'badge-primary' : 'badge-secondary'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="text-right px-4 py-3 text-nowrap">
                            {user.role !== 'superadmin' ? (
                              <>
                                <button 
                                  className={`btn btn-sm mr-2 px-3 rounded-pill d-inline-flex align-items-center ${
                                    user.role === 'admin' ? 'btn-outline-warning' : 'btn-outline-success'
                                  }`}
                                  disabled={processingId === user._id}
                                  onClick={() => toggleAdminRole(user)}
                                >
                                  {user.role === 'admin' ? (
                                    <><UserMinus size={14} className="mr-1" /> Remove Admin</>
                                  ) : (
                                    <><UserPlus size={14} className="mr-1" /> Make Admin</>
                                  )}
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger px-3 rounded-pill d-inline-flex align-items-center"
                                  disabled={processingId === user._id}
                                  onClick={() => deleteUser(user._id)}
                                >
                                  <Trash2 size={14} className="mr-1" /> Delete
                                </button>
                              </>
                            ) : (
                              <span className="text-muted small italic">System Protected</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
