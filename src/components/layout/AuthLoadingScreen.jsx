import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthLoadingScreen = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Show loading
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthLoadingScreen;
