import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PublicRoute component restricts access to certain pages (like Login and Register)
 * for authenticated users. If a user is already logged in, it redirects them to the Home page.
 */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // If auth status is still loading (checking localStorage), don't redirect yet
  if (loading) {
    return (
      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // If user is already authenticated, redirect them away from public-only pages
  if (user) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, render the child component (Login/Register)
  return children;
};

export default PublicRoute;
