import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();

  const redirectTo =
    (location.state && location.state.from) ||
    (user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "employee"
        ? "/employee/projects"
        : user?.role === "client"
          ? "/client/projects"
          : "/");

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  const demoEmail = import.meta.env.VITE_DEMO_ADMIN_EMAIL || "admin@yadav.in";
  const demoPassword = import.meta.env.VITE_DEMO_ADMIN_PASSWORD || "Admin@12345";

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="mt-2 text-sm text-slate-600">
        Sign in to access your portal (Admin / Employee / Client).
      </p>

      <form
        className="mt-6 space-y-4 rounded-xl border bg-white p-5 shadow-sm"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setIsSubmitting(true);
          try {
            const u = await login(email.trim(), password);
            const home =
              u.role === "admin"
                ? "/admin/dashboard"
                : u.role === "employee"
                  ? "/employee/projects"
                  : "/client/projects";
            navigate(location.state?.from || home, { replace: true });
          } catch (e) {
            setError(e?.message || "Login failed");
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-4 rounded-xl border bg-white p-4 text-xs text-slate-600 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="font-semibold text-slate-900">Demo credentials</div>
          <button
            type="button"
            className="rounded-lg border px-2 py-1 text-xs font-medium hover:bg-slate-50"
            onClick={() => {
              setEmail(demoEmail);
              setPassword(demoPassword);
            }}
          >
            Use demo admin
          </button>
        </div>
        <div className="mt-1">
          Email: <span className="font-mono">{demoEmail}</span>
        </div>
        <div>
          Password: <span className="font-mono">{demoPassword}</span>
        </div>
      </div>
    </div>
  );
}


