import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (loading && !cart) {
    return (
      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;

  if (items.length === 0) {
    return (
      <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="mb-4 text-muted">
          <ShoppingBag size={80} strokeWidth={1} />
        </div>
        <h2 className="font-weight-bold mb-3">Your cart is empty</h2>
        <p className="text-muted mb-4">Add some products to your cart and they will show up here.</p>
        <Link to="/" className="btn btn-primary btn-lg rounded-pill px-5">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      <h2 className="font-weight-bold mb-5 d-flex align-items-center">
        <ShoppingBag className="mr-3 text-primary" size={28} /> Shopping Cart
      </h2>

      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-0">
              {items.map((item) => (
                <div key={item.product._id} className="p-4 border-bottom last-child-border-0">
                  <div className="row align-items-center">
                    <div className="col-md-2 col-4">
                      <img 
                        src={item.product.image ? (item.product.image.startsWith('http') ? item.product.image : `http://localhost:5000${item.product.image}`) : 'https://via.placeholder.com/300?text=No+Image'} 
                        alt={item.product.name} 
                        onError={(e) => e.target.src='/images/fallback.png'}
                        className="img-fluid rounded" 
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-md-4 col-8">
                      <Link to={`/product/${item.product._id}`} className="text-decoration-none text-dark">
                        <h6 className="font-weight-bold mb-1">{item.product.name}</h6>
                      </Link>
                      <p className="text-muted small mb-0">{item.product.category}</p>
                    </div>
                    <div className="col-md-3 col-6 mt-3 mt-md-0">
                      <div className="input-group input-group-sm" style={{ width: '100px' }}>
                        <div className="input-group-prepend">
                          <button 
                            className="btn btn-outline-secondary" 
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          ><Minus size={14} /></button>
                        </div>
                        <input type="text" className="form-control text-center bg-white border-left-0 border-right-0" value={item.quantity} readOnly />
                        <div className="input-group-append">
                          <button 
                            className="btn btn-outline-secondary" 
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          ><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2 col-4 mt-3 mt-md-0 text-md-right text-left">
                      <span className="font-weight-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="col-md-1 col-2 mt-3 mt-md-0 text-right">
                      <button 
                        className="btn btn-link text-danger p-0" 
                        onClick={() => removeFromCart(item.product._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '1rem', backgroundColor: '#fdf8f0' }}>
            <h5 className="font-weight-bold mb-4">Order Summary</h5>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Subtotal</span>
              <span className="font-weight-bold">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Shipping</span>
              <span className="text-success font-weight-bold">Free</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4">
              <h5 className="font-weight-bold">Total</h5>
              <h5 className="font-weight-bold text-primary">${totalPrice.toFixed(2)}</h5>
            </div>
            <button 
              className="btn btn-primary btn-lg w-100 py-3 rounded-pill font-weight-bold d-flex align-items-center justify-content-center"
              onClick={() => navigate('/checkout')}
            >
              Checkout <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
