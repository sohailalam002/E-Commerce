import React from 'react';

const About = () => {
  return (
    <div className="container py-5 my-5">
      <div className="row align-items-center">
        <div className="col-lg-6 mb-4 mb-lg-0 pr-lg-5">
          <span className="text-primary font-weight-bold text-uppercase tracking-wide small">Who We Are</span>
          <h1 className="display-4 font-weight-bold mt-2 mb-4">About E-Commerce Premium</h1>
          <p className="lead text-muted mb-4">
            Founded in 2026, E-Commerce Premium has become the paramount destination for exclusive, high-fidelity lifestyle items.
          </p>
          <p className="text-secondary mb-4">
            Our mission is simple: bridging the gap between extraordinary quality and global accessibility. Every product in our catalog embodies our rigorous standards, carefully curated by a network of globally recognizable experts. From logistics to checkout, we've refined the digital commerce experience into an absolute art form.
          </p>
          <div className="row border-top pt-4 mt-4 text-center">
            <div className="col-4">
              <h3 className="font-weight-bold text-primary">10K+</h3>
              <span className="small text-muted text-uppercase">Products</span>
            </div>
            <div className="col-4 border-left">
              <h3 className="font-weight-bold text-primary">50+</h3>
              <span className="small text-muted text-uppercase">Countries</span>
            </div>
            <div className="col-4 border-left">
              <h3 className="font-weight-bold text-primary">99%</h3>
              <span className="small text-muted text-uppercase">Happy Clients</span>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="row">
            <div className="col-6 mt-5 pt-3">
              <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&q=80" alt="Team" onError={(e) => e.target.src = '/images/fallback.png'} className="img-fluid rounded shadow w-100 mb-4" style={{ height: 250, objectFit: 'cover' }} />
              <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80" alt="Office" onError={(e) => e.target.src = '/images/fallback.png'} className="img-fluid rounded shadow w-100" style={{ height: 200, objectFit: 'cover' }} />
            </div>
            <div className="col-6">
              <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&q=80" alt="Work" onError={(e) => e.target.src = '/images/fallback.png'} className="img-fluid rounded shadow w-100" style={{ height: 474, objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
