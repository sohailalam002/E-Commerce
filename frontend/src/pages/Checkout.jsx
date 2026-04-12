import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await api.get('/cart');
        if (!data.items || data.items.length === 0) {
          navigate('/cart');
          return;
        }
        setCart(data);
      } catch (error) {
        toast.error('Failed to fetch cart');
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/orders', {
        orderItems: cart.items,
        shippingAddress,
        paymentMethod,
        totalPrice: cart.totalPrice
      });
      toast.success('Order placed successfully!');
      // Clear cart is usually handled by backend on order success, but we can also do it here if needed
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      <button onClick={() => navigate('/cart')} className="btn btn-link text-decoration-none text-secondary mb-4 p-0">
        <ArrowLeft size={20} className="mr-1"/> Back to Cart
      </button>

      <div className="row">
        {/* Checkout Form */}
        <div className="col-lg-7 mb-4">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '1rem' }}>
            <h4 className="font-weight-bold mb-4">Shipping Details</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label className="small font-weight-bold text-secondary text-uppercase">Address</label>
                <input 
                  type="text" 
                  className="form-control bg-light border-0 py-2" 
                  placeholder="Enter your full address"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                  required 
                />
              </div>
              <div className="row">
                <div className="col-md-6 form-group mb-3">
                  <label className="small font-weight-bold text-secondary text-uppercase">City</label>
                  <input 
                    type="text" 
                    className="form-control bg-light border-0 py-2" 
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    required 
                  />
                </div>
                <div className="col-md-6 form-group mb-3">
                  <label className="small font-weight-bold text-secondary text-uppercase">Postal Code</label>
                  <input 
                    type="text" 
                    className="form-control bg-light border-0 py-2" 
                    placeholder="Postal Code"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="form-group mb-4">
                <label className="small font-weight-bold text-secondary text-uppercase">Country</label>
                <input 
                  type="text" 
                  className="form-control bg-light border-0 py-2" 
                  placeholder="Country"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                  required 
                />
              </div>

              <h4 className="font-weight-bold mb-4 pt-2">Payment Method</h4>
              <div className="card border-0 bg-light p-3 mb-4" style={{ borderRadius: '0.75rem' }}>
                <div className="custom-control custom-radio mb-2">
                  <input 
                    type="radio" 
                    id="paypal" 
                    name="paymentMethod" 
                    className="custom-control-input" 
                    checked={paymentMethod === 'PayPal'}
                    onChange={() => setPaymentMethod('PayPal')}
                  />
                  <label className="custom-control-label d-flex align-items-center" htmlFor="paypal">
                    <span className="font-weight-bold ml-2">PayPal or Credit Card</span>
                  </label>
                </div>
                <div className="custom-control custom-radio">
                  <input 
                    type="radio" 
                    id="stripe" 
                    name="paymentMethod" 
                    className="custom-control-input"
                    checked={paymentMethod === 'Stripe'}
                    onChange={() => setPaymentMethod('Stripe')}
                  />
                  <label className="custom-control-label d-flex align-items-center" htmlFor="stripe">
                    <span className="font-weight-bold ml-2">Stripe</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100 py-3 rounded-pill font-weight-bold d-flex align-items-center justify-content-center">
                Place Order <ArrowRight size={20} className="ml-2" />
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary Checkout */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm p-4 sticky-top" style={{ borderRadius: '1rem', top: '130px' }}>
            <h5 className="font-weight-bold mb-4">In Your Bag</h5>
            <div className="mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {cart.items.map((item) => (
                <div key={item.product._id} className="d-flex align-items-center mb-3">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    onError={(e) => e.target.src='/images/fallback.png'}
                    className="rounded mr-3" 
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                  <div className="flex-fill">
                    <h6 className="font-weight-bold mb-0 small">{item.product.name} x {item.quantity}</h6>
                    <p className="text-muted extra-small mb-0">${item.price}</p>
                  </div>
                  <div className="font-weight-bold small">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="border-top pt-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Subtotal</span>
                <span className="font-weight-bold small">${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Shipping</span>
                <span className="text-success font-weight-bold small">FREE</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <h5 className="font-weight-bold">Total</h5>
                <h5 className="font-weight-bold text-primary">${cart.totalPrice.toFixed(2)}</h5>
              </div>
            </div>

            <div className="mt-4 pt-2 border-top">
              <div className="d-flex align-items-center text-muted small mb-2">
                <Shield size={16} className="mr-2 text-primary" /> 
                <span>Secure payment processing</span>
              </div>
              <div className="d-flex align-items-center text-muted small">
                <Truck size={16} className="mr-2 text-primary" /> 
                <span>Fast & reliable delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
