import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider.jsx";

export default function HomePage() {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-medium">Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const home =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "employee"
        ? "/employee/projects"
        : "/client/projects";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Choose where you want to go next.</p>
      </div>
      <Link
        to={home}
        className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Go to your portal
      </Link>
    </div>
  );
}


