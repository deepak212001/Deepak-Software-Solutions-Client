import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.jsx";

export default function Layout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const appName = import.meta.env.VITE_APP_NAME || "Deepak Software Solutions";

  const navItems = (() => {
    if (!isAuthenticated || !user) return [{ to: "/login", label: "Login" }];
    if (user.role === "admin") {
      return [
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/users", label: "Users" },
        { to: "/admin/client-companies", label: "Client Companies" },
        { to: "/admin/services", label: "Services" },
        { to: "/admin/requests", label: "Requests" },
        { to: "/admin/projects", label: "Projects" },
        { to: "/messages", label: "Messages" },
        { to: "/profile", label: "Profile" },
      ];
    }
    if (user.role === "employee") {
      return [
        { to: "/employee/projects", label: "Projects" },
        { to: "/messages", label: "Messages" },
        { to: "/profile", label: "Profile" },
      ];
    }
    return [
      { to: "/client/projects", label: "Projects" },
      { to: "/client/requests", label: "Request Service" },
      { to: "/messages", label: "Messages" },
      { to: "/profile", label: "Profile" },
    ];
  })();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="font-semibold tracking-tight">
            {appName}
          </NavLink>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-4 text-sm text-slate-600">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    isActive ? "font-medium text-slate-900" : "hover:text-slate-900"
                  }
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <div className="hidden text-xs text-slate-500 sm:block">
                  {user.name} • {user.role}
                </div>
                <button
                  type="button"
                  className="rounded-lg border bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}


