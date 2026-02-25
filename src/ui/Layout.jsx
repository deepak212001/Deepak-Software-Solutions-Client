import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.jsx";
import Button from "./components/Button.jsx";
import { cn } from "./components/cn.js";

export default function Layout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const appName = import.meta.env.VITE_APP_NAME || "Deepak Software Solutions";
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo(() => {
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
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="app-container flex items-center justify-between py-3">
          <NavLink to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 to-royal-700 text-white shadow-soft">
              <span className="font-serif text-sm">D</span>
            </div>
            <div className="leading-tight">
              <div className="font-serif text-[15px] font-semibold tracking-tight">{appName}</div>
              <div className="text-xs text-slate-500">Portal</div>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 text-sm md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-2xl px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900",
                    isActive ? "bg-slate-900 text-white hover:bg-slate-900 hover:text-white" : ""
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="hidden text-right sm:block">
                <div className="text-xs font-semibold text-slate-900">{user.name}</div>
                <div className="text-xs text-slate-500">{user.role}</div>
              </div>
            ) : null}

            {isAuthenticated && user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            ) : null}

            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white/70 shadow-sm backdrop-blur hover:bg-white md:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="border-t border-slate-200/70 bg-white/70 backdrop-blur md:hidden">
            <div className="app-container py-3">
              <div className="grid gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100",
                        isActive ? "bg-slate-900 text-white hover:bg-slate-900" : ""
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <main className="app-container py-10">
        <Outlet />
      </main>
    </div>
  );
}


