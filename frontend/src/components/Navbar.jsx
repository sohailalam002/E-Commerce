import React, { useState } from 'react';
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

const Navbar = () => {
  const { categories, searchTerm, setSearchTerm } = useProducts();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    logout(navigate);
    setIsMenuOpen(false);
  };

  const handleCategorySelect = (e, category) => {
    e.preventDefault();
    if (category === 'all') {
      navigate('/');
    } else {
      navigate(`/?category=${encodeURIComponent(category)}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar-premium">
      <div className="container flex justify-between items-center h-100" style={{ height: '100%' }}>
        {/* LOGO */}
        <Link to="/" className="flex items-center" style={{ textDecoration: 'none', color: 'var(--text-dark)', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🛍️</span>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Cartify</span>
        </Link>

        {/* DESKTOP SEARCH */}
        <div className="d-none d-md-block" style={{ flex: '1', maxWidth: '500px', margin: '0 40px' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search products..." 
            style={{ borderRadius: '50px', border: 'none', padding: '10px 20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* CONTROLS */}
        <div className="flex items-center" style={{ gap: '20px' }}>
          <Link to="/cart" style={{ position: 'relative', color: 'var(--text-dark)', display: 'flex', alignItems: 'center' }}>
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span style={{ 
                position: 'absolute', top: '-8px', right: '-12px', 
                background: 'red', color: 'white', borderRadius: '50%', 
                width: '20px', height: '20px', fontSize: '12px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Desktop Auth */}
          <div className="d-none d-md-flex items-center" style={{ gap: '15px' }}>
            {user ? (
              <div className="dropdown">
                <button className="btn-custom btn-outline-custom" style={{ padding: '8px 20px', minHeight: '40px' }} data-toggle="dropdown">
                  {user.name} <ChevronDown size={16} />
                </button>
                <div className="dropdown-menu dropdown-menu-right">
                  {user.role?.roleName === 'admin' && <Link className="dropdown-item" to="/admin-dashboard">Admin Dashboard</Link>}
                  {user.role?.roleName === 'superadmin' && <Link className="dropdown-item" to="/superadmin-dashboard text-primary">Super Admin</Link>}
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item text-danger">Logout</button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-link" style={{ fontWeight: '600' }}>Login</Link>
                <Link to="/register" className="btn-custom btn-primary-custom" style={{ padding: '8px 24px', minHeight: '40px' }}>Register</Link>
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <button 
            className="d-md-none" 
            onClick={() => setIsMenuOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`menu-overlay ${isMenuOpen ? 'show' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="m-0">Menu</h3>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={28} />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="mb-4">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search..." 
            style={{ borderRadius: '8px' }} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <nav className="flex flex-column" style={{ gap: '10px' }}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link to="/services" className="nav-link" onClick={() => setIsMenuOpen(false)}>Services</Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          
          <hr />
          <p className="font-weight-bold mb-2">Categories</p>
          <a href="#" className="nav-link" onClick={(e) => handleCategorySelect(e, 'all')}>All Products</a>
          {categories.filter(c => c !== 'all').map((cat) => (
            <a href="#" className="nav-link text-capitalize" key={cat} onClick={(e) => handleCategorySelect(e, cat)}>
              {cat}
            </a>
          ))}

          <hr />
          {user ? (
            <>
              <p className="font-weight-bold mb-2">Account: {user.name}</p>
              {user.role?.roleName === 'admin' && <Link to="/admin-dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>}
              <button onClick={handleLogout} className="nav-link text-danger border-0 bg-transparent w-100 text-left">Logout</button>
            </>
          ) : (
            <div className="flex flex-column" style={{ gap: '10px', marginTop: '10px' }}>
              <Link to="/login" className="btn-custom btn-outline-custom w-100" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-custom btn-primary-custom w-100" onClick={() => setIsMenuOpen(false)}>Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
