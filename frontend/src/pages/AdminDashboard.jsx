import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify';
import {
  Package,
  ShoppingCart,
  MessageSquare,
  Users,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  LayoutDashboard,
  DollarSign
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Form State for Add Product
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    countInStock: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' // default placeholder
  });

  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchOrders();
    fetchMessages();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      if (data.success) setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/order');
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/contact');
      if (data.success) setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      let imageUrl = newProduct.image;

      // STEP 1: Upload image if selected
      if (selectedFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
          const { data } = await api.post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          imageUrl = data.imageUrl;
          toast.success('Image uploaded successfully!');
        } catch (err) {
          toast.error('Image upload failed');
          setUploading(false);
          setLoading(false);
          return;
        }
        setUploading(false);
      }

      const productData = { ...newProduct, image: imageUrl };

      if (editingId) {
        await api.put(`/products/${editingId}`, productData);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', productData);
        toast.success('Product added successfully!');
      }
      resetForm();
      fetchProducts();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process product');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewProduct({ name: '', price: '', category: '', description: '', countInStock: '', image: '' });
    setSelectedFile(null);
    setEditingId(null);
    // Reset file input manually since it's uncontrolled for the file itself
    const fileInput = document.getElementById('productImage');
    if (fileInput) fileInput.value = '';
  };

  const handleEditClick = (p) => {
    setEditingId(p._id);
    setNewProduct({
      name: p.name,
      price: p.price,
      category: p.category,
      description: p.description,
      countInStock: p.countInStock,
      image: p.image
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/300?text=No+Image';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
        fetchStats();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting product');
        console.error('Delete error:', error);
      }
    }
  };

  const markMessageSeen = async (id) => {
    try {
      await api.put(`/contact/${id}`);
      toast.success('Marked as seen');
      fetchMessages();
    } catch (error) {
      toast.error('Error updating message status');
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/order/${id}`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Error updating order');
    }
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100 mt-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h1 className="display-4 font-weight-bold text-primary mb-2">Admin Dashboard</h1>
            <p className="text-muted lead">Manage your store operations efficiently</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-wrap bg-white p-1 p-lg-2 shadow-sm rounded-lg" style={{ borderRadius: '15px', gap: '5px' }}>
              <button
                className={`btn flex-fill py-3 px-2 ${activeTab === 'stats' ? 'btn-primary' : 'btn-light'}`}
                style={{ borderRadius: '12px', minWidth: '100px', fontSize: '14px' }}
                onClick={() => setActiveTab('stats')}
              >
                <LayoutDashboard className="d-block d-md-inline-block mb-1 mb-md-0 mr-md-2" size={18} /> Stats
              </button>
              <button
                className={`btn flex-fill py-3 px-2 ${activeTab === 'products' ? 'btn-primary' : 'btn-light'}`}
                style={{ borderRadius: '12px', minWidth: '100px', fontSize: '14px' }}
                onClick={() => setActiveTab('products')}
              >
                <Package className="d-block d-md-inline-block mb-1 mb-md-0 mr-md-2" size={18} /> Products
              </button>
              <button
                className={`btn flex-fill py-3 px-2 ${activeTab === 'orders' ? 'btn-primary' : 'btn-light'}`}
                style={{ borderRadius: '12px', minWidth: '100px', fontSize: '14px' }}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingCart className="d-block d-md-inline-block mb-1 mb-md-0 mr-md-2" size={18} /> Orders
              </button>
              <button
                className={`btn flex-fill py-3 px-2 ${activeTab === 'messages' ? 'btn-primary' : 'btn-light'}`}
                style={{ borderRadius: '12px', minWidth: '100px', fontSize: '14px' }}
                onClick={() => setActiveTab('messages')}
              >
                <MessageSquare className="d-block d-md-inline-block mb-1 mb-md-0 mr-md-2" size={18} /> Messages
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="row">
          <div className="col-12">
            {activeTab === 'stats' && stats && (
              <div className="row text-center">
                <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={32} />} color="primary" />
                <StatCard title="Total Products" value={stats.totalProducts} icon={<Package size={32} />} color="success" />
                <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingCart size={32} />} color="warning" />
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue}`} icon={<DollarSign size={32} />} color="danger" />
              </div>
            )}

            {activeTab === 'products' && (
              <div className="bg-white p-4 shadow-sm rounded-lg" style={{ borderRadius: '15px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="font-weight-bold mb-0">Manage Products</h3>
                  <button className="btn btn-primary d-flex align-items-center rounded-pill" data-toggle="modal" data-target="#addProductModal" onClick={resetForm}>
                    <Plus size={20} className="mr-1" /> Add New Product
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="thead-light">
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p._id}>
                          <td><img src={getImageUrl(p.image)} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '5px', objectFit: 'cover' }} /></td>
                          <td className="font-weight-bold">{p.name}</td>
                          <td><span className="badge badge-secondary px-3 py-2">{p.category}</span></td>
                          <td className="text-primary font-weight-bold">${p.price}</td>
                          <td>{p.countInStock}</td>
                          <td>
                            <div className="d-flex">
                              <button className="btn btn-sm btn-outline-primary border-0 rounded-circle p-2 mr-2"
                                data-toggle="modal" data-target="#addProductModal" onClick={() => handleEditClick(p)}>
                                <CheckCircle size={18} />
                              </button>
                              <button className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2" onClick={() => deleteProduct(p._id)}>
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white p-4 shadow-sm rounded-lg" style={{ borderRadius: '15px' }}>
                <h3 className="font-weight-bold mb-4">All Orders</h3>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="thead-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o._id}>
                          <td className="small text-muted">{o._id.substring(0, 8)}...</td>
                          <td className="font-weight-bold">{o.user?.name || 'Guest'}</td>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td className="text-success font-weight-bold">${o.totalPrice}</td>
                          <td>
                            <span className={`badge px-3 py-2 ${o.isDelivered ? 'badge-success' : 'badge-warning'}`}>
                              {o.isDelivered ? 'Delivered' : 'Pending'}
                            </span>
                          </td>
                          <td>
                            {!o.isDelivered && (
                              <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => updateOrderStatus(o._id, 'delivered')}>
                                Mark Delivered
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="bg-white p-4 shadow-sm rounded-lg" style={{ borderRadius: '15px' }}>
                <h3 className="font-weight-bold mb-4">Customer Messages</h3>
                <div className="row">
                  {messages.map(m => (
                    <div key={m._id} className="col-md-6 mb-4">
                      <div className={`card h-100 border-left-${m.isSeen ? 'secondary' : 'primary'} shadow-sm border-0`} style={{ borderLeft: m.isSeen ? '5px solid #6c757d' : '5px solid #007bff' }}>
                        <div className="card-body">
                          <div className="d-flex justify-content-between mb-2">
                            <h5 className="font-weight-bold mb-0">{m.name}</h5>
                            {!m.isSeen ? <span className="badge badge-primary px-2 py-1">New</span> : <span className="badge badge-secondary px-2 py-1">Read</span>}
                          </div>
                          <p className="small text-muted mb-3">{m.email}</p>
                          <p className="card-text">{m.message}</p>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <small className="text-muted"><Clock size={14} className="mr-1" /> {new Date(m.createdAt).toLocaleString()}</small>
                            {!m.isSeen && (
                              <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => markMessageSeen(m._id)}>
                                Mark as Read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <div className="modal fade" id="addProductModal" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
            <div className="modal-header border-0 bg-primary text-white" style={{ borderRadius: '15px 15px 0 0' }}>
              <h5 className="modal-title font-weight-bold">
                {editingId ? <CheckCircle size={20} className="mr-1" /> : <Plus size={20} className="mr-1" />}
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h5>
              <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close" onClick={resetForm}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small text-muted text-uppercase">Product Name</label>
                    <input type="text" className="form-control rounded-lg shadow-none border-light py-4" required
                      value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small text-muted text-uppercase">Price ($)</label>
                    <input type="number" className="form-control rounded-lg shadow-none border-light py-4" required
                      value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small text-muted text-uppercase">Category</label>
                    <input type="text" className="form-control rounded-lg shadow-none border-light py-4" required
                      value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small text-muted text-uppercase">Stock Count</label>
                    <input type="number" className="form-control rounded-lg shadow-none border-light py-4" required
                      value={newProduct.countInStock} onChange={(e) => setNewProduct({ ...newProduct, countInStock: e.target.value })} />
                  </div>
                  <div className="col-12 form-group">
                    <label className="font-weight-bold small text-muted text-uppercase">Product Image</label>
                    <div className="custom-file rounded-lg overflow-hidden">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="productImage"
                        onChange={handleFileChange}
                      />
                      <label className="custom-file-label py-2" htmlFor="productImage">
                        {selectedFile ? selectedFile.name : 'Choose local file...'}
                      </label>
                    </div>
                    {newProduct.image && !selectedFile && (
                      <div className="mt-2 d-flex align-items-center">
                        <small className="text-muted mr-2">Current path:</small>
                        <code className="small text-truncate" style={{ maxWidth: '200px' }}>{newProduct.image}</code>
                        <img src={getImageUrl(newProduct.image)} alt="preview" className="ml-auto rounded shadow-sm" style={{ height: '40px' }} />
                      </div>
                    )}
                  </div>
                  <div className="col-12 form-group">
                    <label className="font-weight-bold small text-muted text-uppercase">Description</label>
                    <textarea className="form-control rounded-lg shadow-none border-light" rows="4" required
                      value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4">
                <button type="button" className="btn btn-light rounded-pill px-4" data-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={loading || uploading}>
                  {uploading ? 'Uploading...' : loading ? 'Processing...' : (editingId ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="col-md-3 mb-4">
    <div className={`card border-0 shadow-sm bg-white rounded-lg overflow-hidden h-100 transition-hover`}>
      <div className="card-body p-4">
        <div className={`text-${color} mb-3`}>{icon}</div>
        <h6 className="text-muted text-uppercase font-weight-bold mb-1" style={{ letterSpacing: '1px', fontSize: '12px' }}>{title}</h6>
        <h2 className="mb-0 font-weight-bold">{value}</h2>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
