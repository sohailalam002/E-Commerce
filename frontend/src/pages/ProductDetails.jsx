import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Truck, Shield, Clock } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
      } catch (error) {
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    const success = await addToCart(product._id, quantity);
    setIsAdding(false);
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

  if (!product) return null;

  return (
    <div className="container py-5 mt-5">
      <Link to="/" className="btn btn-link text-decoration-none text-secondary mb-4 p-0">
        <ArrowLeft size={20} className="mr-1"/> Back to Products
      </Link>

      <div className="row">
        {/* Product Image */}
        <div className="col-12 col-lg-6 mb-4">
          <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '1rem' }}>
            <img 
              src={product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`) : 'https://via.placeholder.com/300?text=No+Image'} 
              alt={product.name} 
              onError={(e) => e.target.src='/images/fallback.png'}
              className="img-fluid w-100" 
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="col-12 col-lg-6 pl-lg-5">
          <div className="mb-4">
            <span className="badge badge-pill badge-light text-primary px-3 py-2 mb-2">{product.category}</span>
            <h1 className="font-weight-bold mb-2">{product.name}</h1>
            <div className="d-flex align-items-center mb-3">
              <div className="d-flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    fill={i < Math.floor(product.rating) ? "#ffc107" : "none"} 
                    color="#ffc107" 
                  />
                ))}
              </div>
              <span className="text-muted small">({product.numReviews} Reviews)</span>
            </div>
            <h2 className="text-primary font-weight-bold mb-4">${product.price}</h2>
            <p className="text-muted" style={{ lineHeight: '1.8' }}>{product.description}</p>
          </div>

          <div className="card p-3 p-md-4 border-0 shadow-sm mb-4" style={{ backgroundColor: '#fdf8f0', borderRadius: '1rem' }}>
            <div className="d-flex flex-wrap align-items-center mb-4">
              <label className="font-weight-bold mr-3 mb-2 mb-sm-0 w-100 w-sm-auto">Quantity:</label>
              <div className="input-group" style={{ width: '130px' }}>
                <div className="input-group-prepend">
                  <button 
                    className="btn btn-outline-secondary px-3" 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >-</button>
                </div>
                <input type="text" className="form-control text-center bg-white border-left-0 border-right-0" value={quantity} readOnly />
                <div className="input-group-append">
                  <button 
                    className="btn btn-outline-secondary px-3" 
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  >+</button>
                </div>
              </div>
              <span className="ml-3 text-muted small">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            </div>

            <button 
              className="btn btn-primary btn-lg w-100 py-3 shadow-sm font-weight-bold d-flex align-items-center justify-content-center"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              style={{ borderRadius: '0.75rem' }}
            >
              <ShoppingCart size={20} className="mr-2" /> 
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>

          {/* Delivery Features */}
          <div className="row mt-5">
            <div className="col-4 text-center">
              <div className="text-primary mb-2"><Truck size={24} className="mx-auto" /></div>
              <p className="extra-small font-weight-bold mb-0" style={{fontSize: '11px'}}>Fast Delivery</p>
            </div>
            <div className="col-4 text-center">
              <div className="text-primary mb-2"><Shield size={24} className="mx-auto" /></div>
              <p className="extra-small font-weight-bold mb-0" style={{fontSize: '11px'}}>1 Year Warranty</p>
            </div>
            <div className="col-4 text-center">
              <div className="text-primary mb-2"><Clock size={24} className="mx-auto" /></div>
              <p className="extra-small font-weight-bold mb-0" style={{fontSize: '11px'}}>7 Days Replacement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
