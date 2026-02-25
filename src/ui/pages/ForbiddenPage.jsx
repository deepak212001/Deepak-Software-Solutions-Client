import React from "react";
import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Forbidden</h1>
        <p className="mt-2 text-sm text-slate-600">You don’t have access to this page.</p>
      </div>
      <Link
        to="/"
        className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Go home
      </Link>
    </div>
  );
}


