import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ element, isAuthenticated, userRole }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Allow access to adminpage for all authenticated users
  return element;
};

export default ProtectedRoute;
