import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Function to fetch cart data
  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      setCartCount(0);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      console.log('CartContext: Cart fetched:', data);
      setCart(data.cart);
      
      // Calculate total unique items or total quantity? 
      // User says "total number of items", usually means sum of quantities
      const count = data.cart.items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('CartContext: Fetch error:', error);
      // toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart whenever user status changes
  useEffect(() => {
    fetchCart();
  }, [user]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.info('Please login to add items to cart');
      return false;
    }

    try {
      const { data } = await api.post('/cart', { productId, quantity });
      console.log('CartContext: Add to cart response:', data);
      toast.success('Added to cart!');
      await fetchCart(); // Refresh global state
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
      return false;
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    try {
      const { data } = await api.put(`/cart/${productId}`, { quantity });
      console.log('CartContext: Update quantity response:', data);
      await fetchCart();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      console.log('CartContext: Remove item response:', data);
      toast.success('Item removed');
      await fetchCart();
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = () => {
    setCart(null);
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartCount, 
      loading, 
      fetchCart, 
      addToCart, 
      updateQuantity, 
      removeFromCart,
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
