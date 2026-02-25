import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api.js";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch("/api/admin/dashboard");
        if (cancelled) return;
        setStats(data.stats);
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Failed to load stats");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Overview of users, projects, and pending requests.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Users</div>
          <div className="mt-2 text-3xl font-semibold">{stats ? stats.users : "—"}</div>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Projects</div>
          <div className="mt-2 text-3xl font-semibold">{stats ? stats.projects : "—"}</div>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Pending Requests
          </div>
          <div className="mt-2 text-3xl font-semibold">{stats ? stats.pendingRequests : "—"}</div>
        </div>
      </div>
    </div>
  );
}


