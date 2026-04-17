import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-warning">
      <div className="container text-center text-md-left">
        <div className="row text-center text-md-left">

          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Cartify</h5>
            <p>Your one-stop shop for all your premium needs. Quality guaranteed. Secure payments.</p>
          </div>

          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Products</h5>
            <p><Link to="/?category=trending" className="text-white text-decoration-none" style={{ transition: '0.3s' }}>Trending</Link></p>
            <p><Link to="/?category=electronics" className="text-white text-decoration-none" style={{ transition: '0.3s' }}>Electronics</Link></p>
            <p><Link to="/?category=fashion" className="text-white text-decoration-none" style={{ transition: '0.3s' }}>Fashion</Link></p>
          </div>

          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Useful Links</h5>
            <p><Link to="/about" className="text-white text-decoration-none">About Us</Link></p>
            <p><Link to="/services" className="text-white text-decoration-none">Services</Link></p>
            <p><Link to="/contact" className="text-white text-decoration-none">Contact</Link></p>
          </div>

          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Contact</h5>
            <p><i className="fas fa-home mr-3"></i> India-Bihar(841226)</p>
            <p><i className="fas fa-envelope mr-3"></i> info@Cartify.com</p>
            <p><i className="fas fa-phone mr-3"></i> + 01 234 567 88</p>
          </div>

        </div>

        <hr className="mb-4 bg-secondary" />

        <div className="row align-items-center">
          <div className="col-12 text-center">
            <p className="mb-0"> Copyright ©2026 All rights reserved by:
              <strong className="text-warning">Cartify</strong>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
