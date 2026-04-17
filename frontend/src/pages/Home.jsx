import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Eye, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import Testimonials from '../components/Testimonials';

const Home = () => {
  const { products, loading, searchTerm } = useProducts();
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const displayProducts = categoryFilter
    ? products.filter(p => p.category === categoryFilter)
    : products;

  const filteredProducts = searchTerm 
    ? displayProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : displayProducts;

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  if (loading) return <div className="container mt-5 text-center"><h4>Loading products...</h4></div>;

  return (
    <div className="container mt-5 mb-5">

      {/* Hero Banner Area */}
      <div className="jumbotron bg-light text-center rounded shadow-sm border p-5 mb-5">
        <h1 className="display-4 font-weight-bold mb-3">Welcome to Cartify </h1>
        <p className="lead mb-4">Discover the best products at unbeatable prices.</p>
        {!categoryFilter && (
          <Link to="/" className="btn btn-warning btn-lg rounded-pill px-5 shadow-sm font-weight-bold">Shop Now</Link>
        )}
      </div>

      <div className="row mb-4">
        <div className="col-12 text-center text-md-left">
          <h2 className="font-weight-bold">
            {categoryFilter ? <span className="text-capitalize">{categoryFilter} Products</span> : 'Featured Products'}
          </h2>
          <hr className="bg-warning" style={{ width: '60px', height: '3px', margin: '20px auto 20px 0', border: 'none' }} />
        </div>
      </div>

      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex" key={product._id}>
              <div className="card w-100 shadow-sm border-0 border-bottom border-warning">
                <img
                  src={product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`) : 'https://via.placeholder.com/300?text=No+Image'}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate font-weight-bold mb-1" title={product.name}>{product.name}</h5>
                  <p className="card-text text-muted small mb-3 text-truncate" style={{ maxHeight: '40px', overflow: 'hidden' }}>{product.description}</p>

                  <div className="mt-auto">
                    <h5 className="font-weight-bold text-dark mb-3">₹ {product.price}</h5>
                    <div className="d-flex justify-content-between">
                      <Link to={`/product/${product._id}`} className="btn btn-outline-dark btn-sm rounded-pill flex-fill mr-2 font-weight-bold">
                        <Eye size={16} className="mr-1" /> View
                      </Link>
                      <button onClick={(e) => handleAddToCart(e, product)} className="btn btn-warning btn-sm rounded-pill flex-fill font-weight-bold">
                        <ShoppingCart size={16} className="mr-1" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-muted py-5">
            <h4>No products found</h4>
          </div>
        )}
      </div>

      {/* Testimonials Section */}
      {!categoryFilter && <Testimonials />}
    </div>
  );
};

export default Home;
