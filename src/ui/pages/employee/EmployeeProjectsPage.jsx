import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api.js";

const STATUS_OPTIONS = ["new", "in_progress", "blocked", "completed"];

export default function EmployeeProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  async function load() {
    const data = await apiFetch("/api/employee/projects");
    setProjects(data.projects || []);
  }

  useEffect(() => {
    load().catch((e) => setError(e?.message || "Failed to load projects"));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Projects</h1>
        <p className="mt-2 text-sm text-slate-600">
          You can update the project status, but only Admin can change assignments.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        {projects.map((p) => {
          const id = String(p._id);
          const isBusy = busyId === id;
          return (
            <div key={id} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Client: <span className="font-medium text-slate-900">{p.clientCompany?.name || "—"}</span> •
                    Service: {p.service?.name || "—"}
                  </div>
                  {p.description ? (
                    <div className="mt-2 text-sm text-slate-700">{p.description}</div>
                  ) : null}
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</div>
                  <select
                    className="mt-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
                    value={p.status}
                    disabled={isBusy}
                    onChange={async (e) => {
                      const status = e.target.value;
                      setError("");
                      setBusyId(id);
                      try {
                        await apiFetch(`/api/employee/projects/${id}/status`, {
                          method: "PATCH",
                          body: { status },
                        });
                        await load();
                      } catch (e) {
                        setError(e?.message || "Failed to update status");
                      } finally {
                        setBusyId("");
                      }
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}

        {projects.length === 0 ? (
          <div className="rounded-xl border bg-white p-5 text-sm text-slate-600 shadow-sm">
            No assigned projects yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}


