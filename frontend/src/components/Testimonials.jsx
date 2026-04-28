import React from 'react';

const testimonials = [
  {
    id: 1,
    name: "Virat Kohli",
    text: "The quality of products at Cartify is top-notch. I've never been disappointed with my purchases here.",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Sachin Tendulkar",
    text: "Incredible service and fast delivery. Cartify has become my go-to for all my shopping needs.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "MS Dhoni",
    text: "Highly recommended! The interface is clean and the checkout process is very smooth.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
  }
];

const Testimonials = () => {
  return (
    <section style={{ padding: 'var(--space-md) 0' }}>
      <div className="container">
        <div className="text-center mb-5">
          <p style={{ color: 'var(--accent-color)', fontWeight: '600', marginBottom: '10px' }}>What our customers are saying</p>
          <h2>Customer Testimonials</h2>
        </div>

        <div className="grid" style={{ 
          gap: 'var(--space-sm)', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' 
        }}>
          {testimonials.map((item) => (
            <div key={item.id} className="testimonial-card shadow-sm" style={{ 
              background: '#fff', 
              padding: 'var(--space-sm)', 
              borderRadius: '16px',
              border: '1px solid #eee'
            }}>
              <div className="flex items-center mb-3" style={{ gap: '15px' }}>
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="testimonial-image"
                  style={{ width: '50px', height: '50px', marginBottom: 0 }}
                />
                <h5 className="m-0" style={{ fontSize: '16px' }}>{item.name}</h5>
              </div>
              <p className="text-muted" style={{ fontStyle: 'italic', margin: 0, fontSize: '14px' }}>
                "{item.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

