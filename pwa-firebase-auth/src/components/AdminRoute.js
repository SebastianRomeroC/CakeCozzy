import React from "react";
import { Navigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserRole";

export default function AdminRoute({ children }) {
  const { role, loading } = useUserRole();

  if (loading) return <p>Cargando...</p>;

  if (role === "admin") {
    return children;
  } else {
    return <Navigate to="/home" />;
  }
}
