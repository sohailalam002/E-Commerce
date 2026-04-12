import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SuperAdminRoute = ({ children }) => {
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

  // If no user or user is not a superadmin, redirect to home
  const userRoleName = user.role?.roleName || user.role;
  if (!user || userRoleName !== 'superadmin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default SuperAdminRoute;
