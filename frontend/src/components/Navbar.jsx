import React from 'react';
import { ShoppingCart, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

const Navbar = () => {
  const { categories, searchTerm, setSearchTerm } = useProducts();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    // Use the logout function from AuthContext which handles redirect
    logout(navigate);
  };

  const handleCategorySelect = (e, category) => {
    e.preventDefault();
    if (category === 'all') {
      navigate('/');
    } else {
      navigate(`/?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <header className="fixed-top shadow-sm">
      {/* Top Tier */}
      <div className="navbar-premium py-2">
        <div className="container d-flex justify-content-between align-items-center">
          {/* LOGO */}
          <Link to="/" className="navbar-brand font-weight-bold text-dark m-0 d-flex align-items-center" style={{ fontSize: '24px' }}>
            <span className="mr-2" style={{ fontSize: '28px' }}>🛍️</span> Shiwansh -Cart
          </Link>

          {/* SEARCH */}
          <form className="form-inline mx-auto d-none d-md-flex w-50" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group w-100">
              <input 
                type="text" 
                className="form-control rounded-pill border-0 shadow-sm px-4" 
                placeholder="search" 
                style={{ height: '38px', fontSize: '14px' }} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>

          {/* CONTROLS */}
          <div className="d-flex align-items-center gap-3">
            <Link to="/cart" className="position-relative text-dark text-decoration-none mx-3">
              <ShoppingCart size={24} />
              {cartCount > 0 && <span className="position-absolute badge badge-pill badge-danger" style={{ top: '-8px', right: '-12px' }}>{cartCount}</span>}
            </Link>

            {user ? (
              <div className="dropdown">
                <button className="btn btn-light btn-sm dropdown-toggle rounded-pill px-3 shadow-sm border font-weight-bold" type="button" id="userDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ height: '36px', minWidth: '100px' }}>
                  {user.name}
                </button>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                  {user.role?.roleName === 'admin' && (
                    <Link className="dropdown-item" to="/admin-dashboard">Admin Dashboard</Link>
                  )}
                  {user.role?.roleName === 'superadmin' && (
                    <Link className="dropdown-item text-primary font-weight-bold" to="/superadmin-dashboard">Super Admin Dashboard</Link>
                  )}
                  <div className="dropdown-divider"></div>
                  <button type="button" className="dropdown-item text-danger" style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <div className="d-flex">
                <Link to="/login" className="btn btn-outline-dark btn-sm rounded-pill px-4 mx-2 font-weight-bold">Login</Link>
                <Link to="/register" className="btn btn-dark btn-sm rounded-pill px-4 font-weight-bold">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Tier */}
      <nav className="navbar navbar-expand-md navbar-light bg-white border-bottom">
        <div className="container">
          <button className="navbar-toggler mx-auto" type="button" data-toggle="collapse" data-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-center" id="mainNav">
            <ul className="navbar-nav align-items-center">
              <li className="nav-item mx-3"><Link className="nav-link text-dark font-weight-bold" style={{ fontSize: '14px' }} to="/">Home</Link></li>
              <li className="nav-item mx-3"><Link className="nav-link text-dark font-weight-bold" style={{ fontSize: '14px' }} to="/about">About</Link></li>
              <li className="nav-item mx-3"><Link className="nav-link text-dark font-weight-bold" style={{ fontSize: '14px' }} to="/services">Services</Link></li>
              <li className="nav-item mx-3"><Link className="nav-link text-dark font-weight-bold" style={{ fontSize: '14px' }} to="/contact">Contact</Link></li>
              <li className="nav-item mx-3 dropdown">
                <a className="nav-link dropdown-toggle text-dark font-weight-bold" style={{ fontSize: '14px' }} href="#" id="categoriesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Categories
                </a>
                <div className="dropdown-menu shadow-sm border-0" aria-labelledby="categoriesDropdown">
                  <a className="dropdown-item" href="#" onClick={(e) => handleCategorySelect(e, 'all')}>All Products</a>
                  {categories.filter(c => c !== 'all').map((cat) => (
                    <a className="dropdown-item text-capitalize" href="#" key={cat} onClick={(e) => handleCategorySelect(e, cat)}>{cat}</a>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
