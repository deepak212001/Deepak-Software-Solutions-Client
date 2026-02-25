import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api.js";

export default function ClientProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    const data = await apiFetch("/api/client/projects");
    setProjects(data.projects || []);
  }

  useEffect(() => {
    load().catch((e) => setError(e?.message || "Failed to load projects"));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="mt-2 text-sm text-slate-600">Projects created after your service requests are approved.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p._id} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="mt-1 text-sm text-slate-600">Service: {p.service?.name || "—"}</div>
                {p.description ? <div className="mt-2 text-sm text-slate-700">{p.description}</div> : null}
                <div className="mt-2 text-xs text-slate-500">
                  Created: {p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</div>
                <div className="mt-1 text-sm font-medium">{p.status}</div>
                <div className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Assigned Employees
                </div>
                <div className="mt-1 text-sm text-slate-700">
                  {(p.assignedEmployees || []).length
                    ? p.assignedEmployees.map((e) => e.name).join(", ")
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 ? (
          <div className="rounded-xl border bg-white p-5 text-sm text-slate-600 shadow-sm">
            No projects yet. Submit a service request to get started.
          </div>
        ) : null}
      </div>
    </div>
  );
}


