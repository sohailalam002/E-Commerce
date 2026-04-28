import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Eye, ShoppingCart, Truck, ShieldCheck, Headphones, RotateCcw } from 'lucide-react';
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

  if (loading) return <div className="container text-center" style={{ padding: 'var(--space-lg) 0' }}><h4>Loading products...</h4></div>;

  return (
    <main style={{ paddingBottom: 'var(--space-lg)' }}>
      {/* Hero Section */}
      <section className="bg-light" style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <div className="flex flex-column items-center text-center" style={{ gap: 'var(--space-sm)' }}>
            <h1 style={{ maxWidth: '800px' }}>Discover the Best Products at <span style={{ color: 'var(--accent-color)' }}>Unbeatable Prices</span></h1>
            <p className="text-muted" style={{ maxWidth: '600px', fontSize: 'var(--fs-md)' }}>
              Shop the latest trends in electronics, fashion, and more. Quality guaranteed with every purchase.
            </p>
            {!categoryFilter && (
              <Link to="/" className="btn-custom btn-primary-custom" style={{ padding: '12px 30px', fontSize: '16px' }}>
                Shop Now
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Feature Icons Section */}
      {!categoryFilter && (
        <section style={{ padding: 'var(--space-md) 0' }}>
          <div className="container">
            <div className="feature-grid">
              {[
                { icon: <Truck size={32} />, title: 'Free Shipping', desc: 'On orders over ₹999' },
                { icon: <ShieldCheck size={32} />, title: 'Secure Payment', desc: '100% safe transactions' },
                { icon: <Headphones size={32} />, title: '24/7 Support', desc: 'Dedicated help center' },
                { icon: <RotateCcw size={32} />, title: 'Easy Returns', desc: '30-day return policy' }
              ].map((feature, i) => (
                <div key={i} className="flex items-center" style={{ gap: '15px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ color: 'var(--accent-color)' }}>{feature.icon}</div>
                  <div>
                    <h3 style={{ fontSize: '16px', margin: 0 }}>{feature.title}</h3>
                    <p className="text-muted m-0" style={{ fontSize: '13px' }}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section style={{ padding: 'var(--space-md) 0' }}>
        <div className="container">
          <div className="flex justify-between items-center mb-4">
            <h2 className="m-0">
              {categoryFilter ? <span className="text-capitalize">{categoryFilter} Products</span> : 'Featured Products'}
            </h2>
            {categoryFilter && <Link to="/" className="text-muted small">View All</Link>}
          </div>

          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div className="card-custom" key={product._id}>
                  <img
                    src={product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`) : 'https://via.placeholder.com/300?text=No+Image'}
                    className="card-img"
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h3 className="card-title" title={product.name}>
                      {product.name}
                    </h3>
                    <p className="card-description" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.description || 'No description available for this product.'}
                    </p>
                    <div style={{ marginTop: 'auto' }}>
                      <p className="card-price">₹ {product.price}</p>
                      <div className="flex flex-column" style={{ gap: '10px' }}>
                        <Link to={`/product/${product._id}`} className="btn-custom btn-outline-custom w-full" style={{ minHeight: '40px', padding: '8px 16px' }}>
                          <Eye size={16} /> View
                        </Link>
                        <button onClick={(e) => handleAddToCart(e, product)} className="btn-custom btn-primary-custom w-full" style={{ minHeight: '40px', padding: '8px 16px' }}>
                          <ShoppingCart size={16} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-lg) 0' }}>
                <h4>No products found</h4>
                <p className="text-muted">Try adjusting your search or category filter.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {!categoryFilter && <Testimonials />}
    </main>
  );
};

export default Home;

