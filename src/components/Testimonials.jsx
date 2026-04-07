import React from 'react';

const testimonials = [
  {
    id: 1,
    name: "Virat Kohli",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Sachin Tendulkar",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Victor",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "MS Dhoni",
    text: "The quality of products at Shopsy is top-notch. I've never been disappointed with my purchases here.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Rohit Sharma",
    text: "Incredible service and fast delivery. Shopsy has become my go-to for all my shopping needs.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Hardik Pandya",
    text: "Highly recommended! The interface is clean and the checkout process is very smooth.",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "KL Rahul",
    text: "Great variety of products and very competitive pricing. Truly a premium experience.",
    img: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "Shikhar Dhawan",
    text: "Support team is very helpful. They helped me track my order and resolved my queries quickly.",
    img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 9,
    name: "Jasprit Bumrah",
    text: "The best eCommerce platform I've used so far. The mobile experience is especially great.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
  },
];

const Testimonials = () => {
  // Split data into chunks of 3 for the carousel slides
  const chunks = [];
  for (let i = 0; i < testimonials.length; i += 3) {
    chunks.push(testimonials.slice(i, i + 3));
  }

  // Auto-slide initialization
  React.useEffect(() => {
    // Initialize bootstrap carousel if jQuery is available
    if (window.$) {
      window.$('#testimonialCarousel').carousel({
        interval: 3000,
        ride: 'carousel',
        wrap: true
      });
    }
  }, []);

  return (
    <section className="testimonials-section mb-5">
      <div className="container">
        <div className="text-center mb-5">
          <p className="section-accent mb-1">What our customers are saying</p>
          <h2 className="font-weight-bold" style={{ fontSize: '36px' }}>Testimonials</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit asperiores modi Sit asperiores modi
          </p>
        </div>

        <div id="testimonialCarousel" className="carousel slide" data-ride="carousel" data-interval="5000">
          <ol className="carousel-indicators" style={{ bottom: '-60px' }}>
            {chunks.map((_, index) => (
              <li 
                key={index}
                data-target="#testimonialCarousel" 
                data-slide-to={index} 
                className={index === 0 ? 'active' : ''}
              ></li>
            ))}
          </ol>

          <div className="carousel-inner">
            {chunks.map((chunk, index) => (
              <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                <div className="row mx-0">
                  {chunk.map((item) => (
                    <div className="col-md-4 px-2" key={item.id}>
                      <div className="testimonial-card h-100 shadow-sm">
                        <span className="quote-icon">”</span>
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          className="testimonial-image mb-4"
                        />
                        <p className="testimonial-text mb-4">
                          {item.text}
                        </p>
                        <h5 className="testimonial-name">{item.name}</h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
