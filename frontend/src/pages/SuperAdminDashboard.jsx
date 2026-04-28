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
  AlertCircle,
  ShieldCheck,
  FileText,
  LayoutGrid,
  Plus,
  X,
  Menu,
  ShieldQuestion,
  Key
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // CRUD States for Modals
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', roleId: '' });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserData, setEditUserData] = useState({ id: '', name: '', email: '', roleId: '' });

  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [editRoleData, setEditRoleData] = useState({ id: '', roleName: '', permissions: [] });

  const availablePermissions = ['manage_users', 'manage_roles', 'view_orders', 'system_settings'];
  
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Protection logic: Only superadmin allowed
  useEffect(() => {
    const roleName = userInfo.role?.roleName || userInfo.role;
    if (!userInfo || roleName !== 'superadmin') {
      navigate('/');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const roleName = userInfo?.role?.roleName || userInfo?.role;
    if (userInfo && roleName === 'superadmin') {
      fetchUsers();
      fetchRoles(); // Load roles for modals and tabs
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'assign-roles' && roles.length === 0) {
      fetchRoles();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/superadmin/users'); 
      console.log('GET /api/superadmin/users response:', data);
      
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

  const fetchRoles = async () => {
    try {
      const { data } = await api.get('/roles');
      if (data && data.roles) {
        setRoles(data.roles);
      }
    } catch (err) {
      console.error('Fetch roles error:', err);
      toast.error('Error fetching role definitions');
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

  const handleEditClick = (user) => {
    fetchRoles(); // Ensure roles are fresh
    setEditUserData({
      id: user._id,
      name: user.name,
      email: user.email,
      roleId: user.role?._id || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editUserData.name || !editUserData.email || !editUserData.roleId) {
      return toast.error('Please fill all required fields');
    }

    try {
      setLoading(true);
      const { data } = await api.put(`/superadmin/users/${editUserData.id}`, {
        name: editUserData.name,
        email: editUserData.email,
        roleId: editUserData.roleId // Backend expects roleId or role
      });
      
      if (data.success) {
        toast.success('User updated successfully');
        setUsers(users.map(u => u._id === editUserData.id ? { ...u, name: data.user.name, email: data.user.email, role: data.user.role } : u));
        setShowEditModal(false);
      }
    } catch (err) {
      console.error('Update user error:', err);
      toast.error(err.response?.data?.message || 'Error updating user');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (userId) => {
    const roleId = selectedRoles[userId];
    if (!roleId) return;

    try {
      setProcessingId(userId);
      const { data } = await api.put(`/superadmin/users/${userId}/assign-role`, { roleId });
      
      if (data.success) {
        toast.success(`Role reassigned to ${data.user.role.roleName}`);
        // Update user locally
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: data.user.role } : u));
      }
    } catch (err) {
      console.error('Assign role error:', err);
      toast.error(err.response?.data?.message || 'Error reassigning role');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName) return toast.error('Role name is required');
    
    try {
      setLoading(true);
      const { data } = await api.post('/roles', { roleName: newRoleName, permissions: selectedPermissions });
      if (data.success) {
        toast.success('New role defined successfully');
        setRoles([...roles, data.role]);
        setShowRoleModal(false);
        setNewRoleName('');
        setSelectedPermissions([]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating role');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoleClick = (role) => {
    setEditRoleData({
      id: role._id,
      roleName: role.roleName,
      permissions: role.permissions || []
    });
    setShowEditRoleModal(true);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!editRoleData.roleName) return toast.error('Role name is required');
    
    try {
      setLoading(true);
      const { data } = await api.put(`/roles/${editRoleData.id}`, { roleName: editRoleData.roleName, permissions: editRoleData.permissions });
      if (data.success) {
        toast.success('Role updated successfully');
        setRoles(roles.map(r => r._id === editRoleData.id ? data.role : r));
        setShowEditRoleModal(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating role');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm('Delete this role definition? This cannot be undone.')) {
      try {
        setProcessingId(id);
        const { data } = await api.delete(`/roles/${id}`);
        if (data.success) {
          toast.success('Role removed');
          setRoles(roles.filter(r => r._id !== id));
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error deleting role');
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserData.roleId) return toast.error('Please assign a role');

    try {
      setLoading(true);
      const { data } = await api.post('/superadmin/create-user', newUserData);
      if (data.success) {
        toast.success('User account created');
        setUsers([...users, data.user]);
        setShowUserModal(false);
        setNewUserData({ name: '', email: '', password: '', roleId: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating user');
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (perm) => {
    setSelectedPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const toggleEditPermission = (perm) => {
    setEditRoleData(prev => {
      const currentPerms = prev.permissions;
      return { ...prev, permissions: currentPerms.includes(perm) ? currentPerms.filter(p => p !== perm) : [...currentPerms, perm] };
    });
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
    <div className="container-fluid p-0 min-vh-100 bg-light mt-5">
      <div className="d-flex flex-column flex-lg-row">
        {/* MOBILE SIDEBAR TOGGLE */}
        <div className="d-lg-none bg-dark text-white p-3 d-flex justify-content-between align-items-center sticky-top" style={{ top: '70px', zIndex: 900 }}>
          <div className="d-flex align-items-center">
            <ShieldAlert className="text-primary mr-2" size={24} />
            <h6 className="mb-0 font-weight-bold">Super Admin</h6>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* SIDEBAR */}
        <div className={`admin-sidebar bg-dark text-white p-4 shadow-lg transition-all ${isSidebarOpen ? 'd-block' : 'd-none d-lg-block'}`} 
             style={{ minWidth: '260px', zIndex: 950 }}>
          <div className="mb-5 text-center mt-3 d-none d-lg-block">
            <ShieldAlert className="text-primary mb-2" size={40} />
            <h5 className="font-weight-bold">Super Admin</h5>
            <div className="small text-muted border-top border-secondary pt-2 mt-2">Management Panel</div>
          </div>
          
          <ul className="nav flex-column mt-3 mt-lg-0">
            <li className="nav-item mb-2 mb-lg-3">
              <button 
                onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}
                className={`btn btn-block text-left d-flex align-items-center transition-all px-3 py-2 rounded-lg border-0 ${
                  activeTab === 'users' ? 'btn-primary shadow text-white' : 'text-light'
                }`}
              >
                <Users className="mr-3" size={20} />
                <span className="font-weight-medium">User Accounts</span>
              </button>
            </li>
            
            <li className="nav-item mb-2 mb-lg-3">
              <button 
                onClick={() => { setActiveTab('roles'); setIsSidebarOpen(false); }}
                className={`btn btn-block text-left d-flex align-items-center transition-all px-3 py-2 rounded-lg border-0 ${
                  activeTab === 'roles' ? 'btn-primary shadow text-white' : 'text-light'
                }`}
              >
                <ShieldCheck className="mr-3" size={20} />
                <span className="font-weight-medium">Role Definitions</span>
              </button>
            </li>

            <li className="nav-item">
              <button 
                onClick={() => { setActiveTab('assign-roles'); setIsSidebarOpen(false); }}
                className={`btn btn-block text-left d-flex align-items-center transition-all px-3 py-2 rounded-lg border-0 ${
                  activeTab === 'assign-roles' ? 'btn-primary shadow text-white' : 'text-light'
                }`}
              >
                <LayoutGrid className="mr-3" size={20} />
                <span className="font-weight-medium">Assign Roles</span>
              </button>
            </li>
          </ul>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-grow-1 p-3 p-lg-5 admin-content">
          <div className="container-fluid">
            {activeTab === 'users' && (
              <>
                <div className="row mb-5 align-items-center">
                  <div className="col-md-8">
                    <h1 className="display-4 font-weight-bold text-dark mb-2">User Accounts</h1>
                    <p className="lead text-muted">Manage system users and administrative access.</p>
                  </div>
                  <div className="col-md-4 text-right">
                    <button 
                      className="btn btn-primary px-4 py-2 rounded-pill shadow-sm d-inline-flex align-items-center"
                      onClick={() => setShowUserModal(true)}
                    >
                      <Plus className="mr-2" size={20} /> Create New Account
                    </button>
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
                                      user.role?.roleName === 'superadmin' ? 'badge-danger' : 
                                      user.role?.roleName === 'admin' ? 'badge-primary' : 'badge-secondary'
                                    }`}>
                                      {user.role?.roleName || 'No Role'}
                                    </span>
                                  </td>
                                  <td className="text-right px-4 py-3">
                                    <div className="d-flex justify-content-end align-items-center" style={{ gap: '8px' }}>
                                      {user.role?.roleName !== 'superadmin' ? (
                                        <>
                                          <button 
                                            className="btn btn-sm btn-outline-info rounded-pill px-3 d-flex align-items-center transition-all"
                                            disabled={processingId === user._id}
                                            onClick={() => handleEditClick(user)}
                                          >
                                            <ShieldCheck size={14} className="mr-1" /> Edit
                                          </button>
                                          <button 
                                            className="btn btn-sm btn-outline-danger rounded-pill px-3 d-flex align-items-center transition-all"
                                            disabled={processingId === user._id}
                                            onClick={() => deleteUser(user._id)}
                                          >
                                            <Trash2 size={14} className="mr-1" /> Delete
                                          </button>
                                        </>
                                      ) : (
                                        <span className="badge badge-light text-muted px-3 py-2 rounded-pill border">System Protected</span>
                                      )}
                                    </div>
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
              </>
            )}

            {activeTab === 'roles' && (
              <>
                <div className="row mb-5 align-items-center">
                  <div className="col-md-8">
                    <h1 className="display-4 font-weight-bold text-dark mb-2">Role Definitions</h1>
                    <p className="lead text-muted">Define dynamic permission sets for your organization.</p>
                  </div>
                  <div className="col-md-4 text-right">
                    <button 
                      className="btn btn-success px-4 py-2 rounded-pill shadow-sm d-inline-flex align-items-center"
                      onClick={() => setShowRoleModal(true)}
                    >
                      <Plus className="mr-2" size={20} /> Define New Role
                    </button>
                  </div>
                </div>

                <div className="card border-0 shadow-sm rounded-lg overflow-hidden" style={{ borderRadius: '15px' }}>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light text-muted small text-uppercase font-weight-bold">
                        <tr>
                          <th className="px-4 py-3">Role Identity</th>
                          <th className="py-3">Permissions granted</th>
                          <th className="text-right px-4 py-3">Management</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roles.map(role => (
                          <tr key={role._id}>
                            <td className="px-4 py-3 font-weight-bold text-dark">
                              <ShieldCheck className="mr-2 text-primary d-inline" size={18} />
                              {role.roleName}
                            </td>
                            <td className="py-3">
                              {role.permissions?.map(p => (
                                <span key={p} className="badge badge-light border text-muted mr-1 px-2 py-1">
                                  {p.replace('_', ' ')}
                                </span>
                              )) || <span className="text-muted italic">No permissions</span>}
                            </td>
                            <td className="text-right px-4 py-3">
                              <div className="d-flex justify-content-end align-items-center" style={{ gap: '8px' }}>
                                <button 
                                  className="btn btn-sm btn-outline-info rounded-pill px-3 d-flex align-items-center transition-all"
                                  disabled={role.roleName === 'superadmin' || processingId === role._id}
                                  onClick={() => handleEditRoleClick(role)}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger rounded-pill px-3 d-flex align-items-center transition-all"
                                  disabled={role.roleName === 'superadmin' || processingId === role._id}
                                  onClick={() => handleDeleteRole(role._id)}
                                >
                                  <Trash2 size={14} className="mr-1" /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'assign-roles' && (
              <>
                <div className="row mb-5">
                  <div className="col-12">
                    <h1 className="display-4 font-weight-bold text-dark mb-2">Assign Roles</h1>
                    <p className="lead text-muted">Instantly update access levels for any registered user.</p>
                  </div>
                </div>

                <div className="card border-0 shadow-sm rounded-lg overflow-hidden" style={{ borderRadius: '15px' }}>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light text-muted small text-uppercase font-weight-bold">
                        <tr>
                          <th className="px-4 py-3">User Instance</th>
                          <th className="py-3">Current Access</th>
                          <th className="py-3">New Assignment</th>
                          <th className="text-right px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user._id}>
                            <td className="px-4 py-3">
                              <div className="font-weight-bold">{user.name}</div>
                              <div className="small text-muted">{user.email}</div>
                            </td>
                            <td className="py-3">
                              <span className="badge badge-light border px-3 py-2 rounded-pill">
                                {user.role?.roleName || 'None'}
                              </span>
                            </td>
                            <td className="py-3">
                              <select 
                                className="form-control form-control-sm rounded-pill"
                                style={{ maxWidth: '200px' }}
                                disabled={user.email === userInfo?.email}
                                value={selectedRoles[user._id] || user.role?._id || ''}
                                onChange={(e) => setSelectedRoles({ ...selectedRoles, [user._id]: e.target.value })}
                              >
                                <option value="">Select Role</option>
                                {roles.map(r => (
                                  <option key={r._id} value={r._id}>{r.roleName}</option>
                                ))}
                              </select>
                            </td>
                            <td className="text-right px-4 py-3">
                              <button 
                                className="btn btn-primary btn-sm px-4 rounded-pill"
                                disabled={processingId === user._id || !selectedRoles[user._id] || selectedRoles[user._id] === user.role?._id || user.email === userInfo?.email}
                                onClick={() => handleAssignRole(user._id)}
                              >
                                {processingId === user._id ? 'Updating...' : 'Assign'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CREATE ROLE MODAL */}
      {showRoleModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="modal-header border-0 p-4">
                <h4 className="modal-title font-weight-bold">Define Dynamic Role</h4>
                <button type="button" className="close" onClick={() => setShowRoleModal(false)}><X /></button>
              </div>
              <form onSubmit={handleCreateRole}>
                <div className="modal-body p-4 pt-0">
                  <div className="form-group mb-4">
                    <label className="small text-muted font-weight-bold mb-2">ROLE NAME</label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg bg-light border-0" 
                      placeholder="e.g. Moderator"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group mb-0">
                    <label className="small text-muted font-weight-bold mb-3 d-block">PERMISSIONS</label>
                    <div className="row px-2">
                    {availablePermissions.map(p => (
                      <div key={p} className="col-6 mb-2">
                        <div className="custom-control custom-checkbox">
                          <input 
                            type="checkbox" 
                            className="custom-control-input" 
                            id={`perm-${p}`}
                            checked={selectedPermissions.includes(p)}
                            onChange={() => togglePermission(p)}
                          />
                          <label className="custom-control-label small text-dark" htmlFor={`perm-${p}`}>
                            {p.replace('_', ' ')}
                          </label>
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light px-4 py-2 rounded-pill" onClick={() => setShowRoleModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4 py-2 rounded-pill shadow" disabled={loading}>
                    {loading ? 'Processing...' : 'Save Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {showUserModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="modal-header border-0 p-4">
                <h4 className="modal-title font-weight-bold">New User Account</h4>
                <button type="button" className="close" onClick={() => setShowUserModal(false)}><X /></button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="modal-body p-4 pt-0">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label className="small text-muted font-weight-bold mb-2">FULL NAME</label>
                      <input type="text" className="form-control bg-light border-0" required
                        value={newUserData.name} onChange={e => setNewUserData({...newUserData, name: e.target.value})} />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="small text-muted font-weight-bold mb-2">EMAIL ADDRESS</label>
                      <input type="email" className="form-control bg-light border-0" required
                        value={newUserData.email} onChange={e => setNewUserData({...newUserData, email: e.target.value})} />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="small text-muted font-weight-bold mb-2">PASSWORD</label>
                      <input type="password" minLength="4" className="form-control bg-light border-0" required
                        value={newUserData.password} onChange={e => setNewUserData({...newUserData, password: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="small text-muted font-weight-bold mb-2">ASSIGN ROLE</label>
                      <select className="form-control bg-light border-0" required
                        value={newUserData.roleId} onChange={e => setNewUserData({...newUserData, roleId: e.target.value})}>
                        <option value="">Select a role...</option>
                        {roles.map(r => <option key={r._id} value={r._id}>{r.roleName}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light px-4 py-2 rounded-pill" onClick={() => setShowUserModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4 py-2 rounded-pill shadow" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {showEditModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="modal-header border-0 p-4">
                <h4 className="modal-title font-weight-bold">Edit User Account</h4>
                <button type="button" className="close" onClick={() => setShowEditModal(false)}><X /></button>
              </div>
              <form onSubmit={handleUpdateUser}>
                <div className="modal-body p-4 pt-0">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label className="small text-muted font-weight-bold mb-2">FULL NAME</label>
                      <input type="text" className="form-control bg-light border-0" required
                        value={editUserData.name} onChange={e => setEditUserData({...editUserData, name: e.target.value})} />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="small text-muted font-weight-bold mb-2">EMAIL ADDRESS</label>
                      <input type="email" className="form-control bg-light border-0" required
                        value={editUserData.email} onChange={e => setEditUserData({...editUserData, email: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="small text-muted font-weight-bold mb-2">ASSIGN ROLE</label>
                      <select className="form-control bg-light border-0" required
                        value={editUserData.roleId} onChange={e => setEditUserData({...editUserData, roleId: e.target.value})}>
                        <option value="">Select a role...</option>
                        {roles.map(r => <option key={r._id} value={r._id}>{r.roleName}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light px-4 py-2 rounded-pill" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4 py-2 rounded-pill shadow" disabled={loading}>
                    {loading ? 'Updating...' : 'Update User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ROLE MODAL */}
      {showEditRoleModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="modal-header border-0 p-4">
                <h4 className="modal-title font-weight-bold">Edit Role Definition</h4>
                <button type="button" className="close" onClick={() => setShowEditRoleModal(false)}><X /></button>
              </div>
              <form onSubmit={handleUpdateRole}>
                <div className="modal-body p-4 pt-0">
                  <div className="form-group mb-4">
                    <label className="small text-muted font-weight-bold mb-2">ROLE NAME</label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg bg-light border-0" 
                      placeholder="e.g. Moderator"
                      value={editRoleData.roleName}
                      onChange={(e) => setEditRoleData({...editRoleData, roleName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group mb-0">
                    <label className="small text-muted font-weight-bold mb-3 d-block">PERMISSIONS</label>
                    <div className="row px-2">
                    {availablePermissions.map(p => (
                      <div key={p} className="col-6 mb-2">
                        <div className="custom-control custom-checkbox">
                          <input 
                            type="checkbox" 
                            className="custom-control-input" 
                            id={`edit-perm-${p}`}
                            checked={editRoleData.permissions.includes(p)}
                            onChange={() => toggleEditPermission(p)}
                          />
                          <label className="custom-control-label small text-dark" htmlFor={`edit-perm-${p}`}>
                            {p.replace('_', ' ')}
                          </label>
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light px-4 py-2 rounded-pill" onClick={() => setShowEditRoleModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4 py-2 rounded-pill shadow" disabled={loading}>
                    {loading ? 'Processing...' : 'Update Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
