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
      <div className="container d-flex justify-content-center" style={{ paddingTop: 'var(--space-lg)' }}>
        <div className="spinner-border" style={{ color: 'var(--primary-color)' }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  const items = (cart?.items || []).filter(item => item.product);
  const totalPrice = cart?.totalPrice || 0;

  if (items.length === 0) {
    return (
      <div className="container d-flex flex-column align-items-center" style={{ paddingTop: 'var(--space-lg)' }}>
        <div style={{ marginBottom: '30px', color: '#ccc' }}>
          <ShoppingBag size={100} strokeWidth={1} />
        </div>
        <h2 style={{ marginBottom: '15px' }}>Your cart is empty</h2>
        <p className="text-muted" style={{ marginBottom: '30px' }}>Add some products to your cart and they will show up here.</p>
        <Link to="/" className="btn-custom btn-primary-custom" style={{ padding: '12px 40px' }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-lg)' }}>
      <h2 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <ShoppingBag size={32} style={{ color: 'var(--primary-color)' }} /> Shopping Cart
      </h2>

      <div className="row" style={{ gap: '20px', display: 'flex', flexWrap: 'wrap' }}>
        {/* Cart Items */}
        <div style={{ flex: '1 1 600px' }}>
          <div className="card-custom" style={{ border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div className="card-body" style={{ padding: 0 }}>
              {items.map((item) => (
                <div key={item.product._id} className="p-3 p-md-4 border-bottom d-flex flex-column flex-md-row align-items-center" style={{ gap: '15px' }}>
                  <div style={{ width: '100px', flexShrink: 0 }}>
                    <img 
                      src={item.product.image ? (item.product.image.startsWith('http') ? item.product.image : `http://localhost:5000${item.product.image}`) : 'https://via.placeholder.com/300?text=No+Image'} 
                      alt={item.product.name} 
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }}
                    />
                  </div>
                  <div className="flex-grow-1 text-center text-md-left">
                    <Link to={`/product/${item.product._id}`} className="text-decoration-none text-dark">
                      <h3 className="h6 mb-0 font-weight-bold">{item.product.name}</h3>
                    </Link>
                    <p className="text-muted small mb-0">{item.product.category}</p>
                  </div>
                  
                  <div className="d-flex align-items-center justify-content-between justify-content-md-end w-100 w-md-auto" style={{ gap: '20px' }}>
                    <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                      <button 
                        className="btn btn-sm btn-outline-secondary rounded-circle" 
                        style={{ width: '32px', height: '32px', padding: 0 }}
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      ><Minus size={14} /></button>
                      <span className="font-weight-bold" style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button 
                        className="btn btn-sm btn-outline-secondary rounded-circle" 
                        style={{ width: '32px', height: '32px', padding: 0 }}
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      ><Plus size={14} /></button>
                    </div>

                    <div className="text-right" style={{ minWidth: '100px' }}>
                      <span className="h5 mb-0 font-weight-bold text-primary">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    className="btn text-danger p-1"
                    onClick={() => removeFromCart(item.product._id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
          <div className="card-custom" style={{ padding: '30px', backgroundColor: '#fdf8f0', border: 'none' }}>
            <h3 style={{ marginBottom: '24px' }}>Order Summary</h3>
            <div className="flex justify-between" style={{ marginBottom: '15px' }}>
              <span className="text-muted">Subtotal</span>
              <span style={{ fontWeight: 'bold' }}>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ marginBottom: '15px' }}>
              <span className="text-muted">Shipping</span>
              <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Free</span>
            </div>
            <hr style={{ border: '0', borderTop: '1px solid #ddd', margin: '20px 0' }} />
            <div className="flex justify-between" style={{ marginBottom: '30px' }}>
              <h3>Total</h3>
              <h3 style={{ color: 'var(--primary-color)' }}>₹{totalPrice.toFixed(2)}</h3>
            </div>
            <button 
              className="btn-custom btn-primary-custom w-full"
              style={{ padding: '15px' }}
              onClick={() => navigate('/checkout')}
            >
              Checkout <ArrowRight size={20} style={{ marginLeft: '10px' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
