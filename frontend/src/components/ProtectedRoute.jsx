import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.isAdmin) {
    console.log('ProtectedRoute: User is NOT admin, redirecting to home', user);
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute: Access GRANTED', { adminOnly, userIsAdmin: user.isAdmin });
  return children;
};

export default ProtectedRoute;
