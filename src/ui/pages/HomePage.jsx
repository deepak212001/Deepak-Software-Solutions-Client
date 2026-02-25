import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { Card, CardContent } from "../components/Card.jsx";
import Button from "../components/Button.jsx";

export default function HomePage() {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200/70" />
          <div className="mt-3 h-3 w-64 animate-pulse rounded bg-slate-200/70" />
        </CardContent>
      </Card>
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
    <div className="space-y-6">
      <PageHeader title="Welcome back" subtitle="Choose where you want to go next." />

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-serif text-xl font-semibold tracking-tight">Your workspace</div>
            <div className="mt-1 text-sm text-slate-600">Jump directly into the portal for your role.</div>
          </div>
          <Button as={Link} to={home} variant="gold">
            Go to your portal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


