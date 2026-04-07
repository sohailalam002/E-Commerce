// Sample dummy data for seeding the database

export const sampleProducts = [
  {
    name: 'Apple iPhone 15 Pro',
    description:
      'Latest iPhone with A17 Pro chip, titanium design, and 48MP camera system.',
    price: 999.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    stock: 25,
    rating: 4.8,
    numReviews: 120,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description:
      'Premium Android flagship with built-in S Pen, 200MP camera, and Snapdragon 8 Gen 3.',
    price: 1199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    stock: 15,
    rating: 4.7,
    numReviews: 98,
  },
  {
    name: 'Nike Air Max 270',
    description:
      'Iconic sneakers featuring Max Air cushioning for all-day comfort and street style.',
    price: 149.99,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    stock: 50,
    rating: 4.5,
    numReviews: 210,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description:
      'Industry-leading noise cancellation with 30hr battery life and Hi-Res Audio.',
    price: 349.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
    stock: 30,
    rating: 4.9,
    numReviews: 315,
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description:
      'Classic straight fit denim jeans. Timeless style, durable construction.',
    price: 69.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    stock: 100,
    rating: 4.4,
    numReviews: 450,
  },
  {
    name: 'Apple MacBook Air M3',
    description:
      'Ultralight laptop with M3 chip, 18hr battery, Liquid Retina display.',
    price: 1299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
    stock: 20,
    rating: 4.9,
    numReviews: 185,
  },
  {
    name: 'Puma Men\'s Running Shoes',
    description:
      'Lightweight, breathable running shoes with NITRO foam midsole technology.',
    price: 89.99,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    stock: 75,
    rating: 4.3,
    numReviews: 130,
  },
  {
    name: 'Casual Cotton T-Shirt',
    description:
      'Premium 100% cotton unisex t-shirt available in multiple colors.',
    price: 24.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    stock: 200,
    rating: 4.2,
    numReviews: 560,
  },
];

export const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@shopsy.com',
    password: 'admin123',
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john1234',
    isAdmin: false,
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'jane1234',
    isAdmin: false,
  },
  {
    name: 'Super Admin',
    email: 'superadmin@gmail.com',
    role: 'superadmin',
    password: '123456',
    isAdmin: true,
  },
];
