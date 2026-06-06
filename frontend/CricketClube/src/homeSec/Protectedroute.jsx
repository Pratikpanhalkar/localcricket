import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // No token → kick back to login page
  if (!token) {
    return <Navigate to="/register" replace />;
  }

  // Optional: check if token looks expired client-side (no library needed)
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      
      localStorage.removeItem("token");
      localStorage.removeItem("adminId");
      localStorage.removeItem("adminName");
      if (!token) {
      return <Navigate to="/register" replace />;
    }
    }
  } catch {
    
    localStorage.removeItem("token");
    return <Navigate to="/register" replace />; 
  }

  return children;
}

export default ProtectedRoute;