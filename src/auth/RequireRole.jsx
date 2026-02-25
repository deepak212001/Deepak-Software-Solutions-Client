import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";

export default function RequireRole({ roles, children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-medium">Loading…</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!roles?.includes(user.role)) return <Navigate to="/forbidden" replace />;
  return children;
}


