import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Package, Clock, CheckCircle, Truck } from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center text-center py-5">
        <div className="mb-4 text-muted">
          <Package size={80} strokeWidth={1} />
        </div>
        <h2 className="font-weight-bold mb-3">You have no orders yet</h2>
        <p className="text-muted mb-4 max-w-md">Once you place an order, you'll see it here along with its status and details.</p>
        <Link to="/" className="btn btn-primary px-5 rounded-pill font-weight-bold py-2">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      <h2 className="font-weight-bold mb-5 d-flex align-items-center">
        <Package className="mr-3 text-primary" size={28} /> My Orders
      </h2>

      <div className="row">
        <div className="col-lg-10 mx-auto">
          {orders.map((order) => (
            <div key={order._id} className="card border-0 shadow-sm mb-4 overflow-hidden" style={{ borderRadius: '1rem' }}>
              <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
                <div className="d-flex align-items-center">
                   <div className="mr-3 p-2 rounded-circle bg-light">
                      <Clock size={18} className="text-primary" />
                   </div>
                   <div>
                     <p className="small text-muted mb-0">Order ID: {order._id.substring(0, 10).toUpperCase()}</p>
                     <p className="small font-weight-bold mb-0">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                   </div>
                </div>
                <div className="text-right">
                  <p className="small text-muted mb-0">Total Amount</p>
                  <p className="font-weight-bold text-primary mb-0">${order.totalPrice.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="card-body p-4">
                 <div className="row">
                    <div className="col-md-8">
                       <div className="order-items-scroll" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {order.orderItems.map((item, idx) => (
                            <div key={idx} className="d-flex align-items-center mb-3">
                               <img 
                                 src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`) : 'https://via.placeholder.com/300?text=No+Image'} 
                                 alt={item.name} 
                                 onError={(e) => e.target.src='/images/fallback.png'}
                                 className="rounded mr-3" 
                                 style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                               />
                               <div className="flex-fill">
                                  <h6 className="small font-weight-bold mb-0">{item.name}</h6>
                                  <p className="extra-small text-muted mb-0">{item.quantity} x ${item.price}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="col-md-4 mt-3 mt-md-0 border-left pl-md-4">
                       <h6 className="small font-weight-bold text-secondary mb-3">Order Status</h6>
                       <div className="d-flex align-items-start mb-3">
                          <div className={`mr-2 mt-1 p-1 rounded-circle ${order.isPaid ? 'bg-success' : 'bg-warning'}`}>
                             {order.isPaid ? <CheckCircle size={12} color="white" /> : <Clock size={12} color="white" />}
                          </div>
                          <div>
                            <p className="small mb-1 font-weight-bold">{order.isPaid ? 'Paid' : 'Payment Pending'}</p>
                            <p className="extra-small text-muted mb-0">{order.isPaid ? `Success on ${new Date(order.paidAt).toLocaleDateString()}` : 'Please complete payment'}</p>
                          </div>
                       </div>
                       <div className="d-flex align-items-start">
                          <div className={`mr-2 mt-1 p-1 rounded-circle ${order.isDelivered ? 'bg-success' : 'bg-info'}`}>
                             {order.isDelivered ? <CheckCircle size={12} color="white" /> : <Truck size={12} color="white" />}
                          </div>
                          <div>
                            <p className="small mb-1 font-weight-bold">{order.isDelivered ? 'Delivered' : 'In Transit'}</p>
                            <p className="extra-small text-muted mb-0">{order.isDelivered ? `Success on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Order is being processed'}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="card-footer bg-light border-0 py-3 px-4">
                 <div className="row align-items-center">
                    <div className="col-md-8">
                       <p className="extra-small text-muted mb-0">
                         <strong>Shipping Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                       </p>
                    </div>
                    <div className="col-md-4 text-md-right mt-2 mt-md-0">
                       <Link to={`/order/${order._id}`} className="btn btn-outline-primary btn-sm rounded-pill px-3 font-weight-bold d-inline-flex align-items-center">
                         View Details <ChevronRight size={14} className="ml-1" />
                       </Link>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
