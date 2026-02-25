import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { Card, CardContent } from "../components/Card.jsx";
import { Field, Input } from "../components/Inputs.jsx";
import Button from "../components/Button.jsx";
import Alert from "../components/Alert.jsx";

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
    <div className="mx-auto max-w-md space-y-6">
      <PageHeader
        title="Login"
        subtitle="Sign in to access your portal (Admin / Employee / Client)."
      />

      <Card>
        <CardContent>
          <form
            className="space-y-4"
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
            {error ? <Alert variant="danger">{error}</Alert> : null}

            <Field label="Email">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
              />
            </Field>

            <Field label="Password">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </Field>

            <Button type="submit" className="w-full" disabled={isSubmitting} variant="royal">
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="text-xs text-slate-600">
          <div className="flex items-center justify-between gap-3">
            <div className="font-semibold text-slate-900">Demo credentials</div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEmail(demoEmail);
                setPassword(demoPassword);
              }}
            >
              Use demo admin
            </Button>
          </div>
          <div className="mt-2">
            Email: <span className="font-mono">{demoEmail}</span>
          </div>
          <div>
            Password: <span className="font-mono">{demoPassword}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


