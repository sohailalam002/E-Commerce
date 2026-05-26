import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { AUTH_EXPIRED_EVENT, clearAuthStorage } from '../api/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    setToken(null);
  }, []);

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
          clearSession();
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, [clearSession]);

  useEffect(() => {
    const handleAuthExpired = () => {
      clearSession();
      toast.error('Session expired. Please login again.');
      navigate('/login', { replace: true });
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, [clearSession, navigate]);

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
  const logout = (redirect) => {
    clearSession();
    
    toast.info('Logged out successfully');
    
    if (redirect) {
      redirect('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
