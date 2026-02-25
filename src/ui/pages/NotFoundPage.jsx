import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">
        The page you’re looking for doesn’t exist.
      </p>
      <div className="mt-4">
        <Link className="text-sm font-medium text-slate-900 underline" to="/login">
          Go to login
        </Link>
      </div>
    </div>
  );
}


