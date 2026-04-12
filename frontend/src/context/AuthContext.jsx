import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedToken = localStorage.getItem('shopsy_token');
      const storedUser = localStorage.getItem('userInfo');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        try {
          // Re-verify profile to ensure session is still valid
          const { data } = await api.get('/users/profile');
          setUser(data.user);
          localStorage.setItem('userInfo', JSON.stringify(data.user));
        } catch (error) {
          console.error('AuthContext: Session expired or invalid:', error);
          // Auto-logout on failure
          localStorage.removeItem('shopsy_token');
          localStorage.removeItem('userInfo');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/users/login', { email, password });
      
      const userToken = data.user.token;
      const userData = data.user;

      localStorage.setItem('shopsy_token', userToken);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      
      setToken(userToken);
      setUser(userData);
      
      toast.success('Login Successful! Welcome back.');
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const { data } = await api.post('/users/register', userData);
      toast.success('Registration Successful! Please sign in.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout function
  const logout = (navigate) => {
    // 1. Clear Local Storage
    localStorage.removeItem('shopsy_token');
    localStorage.removeItem('userInfo');
    
    // 2. Clear Context State
    setUser(null);
    setToken(null);
    
    toast.info('Logged out successfully');
    
    // 3. Redirect to Login
    if (navigate) {
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
