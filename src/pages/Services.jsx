import React from 'react';

const Services = () => {
  return (
    <div className="container py-5 my-5">
      <div className="text-center mb-5">
        <h1 className="font-weight-bold text-primary">Our Services</h1>
        <p className="lead text-muted">Premium solutions tailored for your ultimate shopping experience.</p>
      </div>

      <div className="row g-4 mt-4">
        {[
          { title: "Global Shipping", icon: "bi-globe", desc: "We ship internationally with real-time tracking and premium packaging to ensure absolute safety.", image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&q=80" },
          { title: "24/7 VIP Support", icon: "bi-headset", desc: "Dedicated concierge service assisting you at any hour, solving all your complex inquiries immediately.", image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=500&q=80" },
          { title: "30-Day Returns", icon: "bi-arrow-return-left", desc: "Don't love it? Send it back. Our hassle-free return policy ensures no questions asked.", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80" },
          { title: "Secure Checkout", icon: "bi-shield-check", desc: "Multi-layered encrypted gateways provide total anonymity and safeguard your financial integrity.", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&q=80" },
          { title: "Personal Styling", icon: "bi-person-badge", desc: "Schedule a session with our in-house experts to curate your wardrobe or living space seamlessly.", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80" },
          { title: "Gift Wrapping", icon: "bi-gift", desc: "Complimentary signature gift-wrapping for special orders, making every unboxing an event.", image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&q=80" }
        ].map((srv, idx) => (
          <div key={idx} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 border-0 shadow-sm text-center">
              <img src={srv.image} className="card-img-top" alt={srv.title} style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '0.25rem', borderTopRightRadius: '0.25rem' }} />
              <div className="card-body p-4">
                <div className="text-primary mb-3 bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: 60, height: 60}}>
                  <span className="font-weight-bold h4 mb-0">{idx+1}</span>
                </div>
                <h5 className="font-weight-bold mb-3">{srv.title}</h5>
                <p className="text-muted mb-0">{srv.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
