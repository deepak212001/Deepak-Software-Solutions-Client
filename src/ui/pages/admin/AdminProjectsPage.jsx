import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api.js";

const STATUS_OPTIONS = ["new", "in_progress", "blocked", "completed"];

function StatusSelect({ value, onChange, disabled }) {
  return (
    <select
      className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const [draft, setDraft] = useState({}); // id -> {name, description, assignedEmployeeIds}

  async function load() {
    const [p, e] = await Promise.all([
      apiFetch("/api/admin/projects"),
      apiFetch("/api/admin/users?role=employee"),
    ]);
    setProjects(p.projects || []);
    setEmployees((e.users || []).filter((u) => u.isActive));
  }

  useEffect(() => {
    load().catch((e) => setError(e?.message || "Failed to load projects"));
  }, []);

  const employeeById = useMemo(() => {
    const m = new Map();
    for (const u of employees) m.set(String(u._id), u);
    return m;
  }, [employees]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="mt-2 text-sm text-slate-600">
          Only Admin can assign/unassign employees. Employees can only update status on projects they’re assigned
          to.
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
          const d = draft[id] || {
            name: p.name || "",
            description: p.description || "",
            assignedEmployeeIds: (p.assignedEmployees || []).map((e) => String(e._id || e)),
          };
          const isBusy = busyId === id;

          return (
            <div key={id} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Client: <span className="font-medium text-slate-900">{p.clientCompany?.name || "—"}</span> •
                    Service: {p.service?.name || "—"}
                  </div>
                  {p.description ? (
                    <div className="mt-2 text-sm text-slate-700">{p.description}</div>
                  ) : null}
                  <div className="mt-2 text-xs text-slate-500">
                    Created: {p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Assigned:{" "}
                    {(p.assignedEmployees || []).length
                      ? p.assignedEmployees.map((e) => e.name).join(", ")
                      : "—"}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</div>
                  <StatusSelect
                    value={p.status}
                    disabled={isBusy}
                    onChange={async (status) => {
                      setError("");
                      setBusyId(id);
                      try {
                        await apiFetch(`/api/admin/projects/${id}`, { method: "PATCH", body: { status } });
                        await load();
                      } catch (e) {
                        setError(e?.message || "Failed to update status");
                      } finally {
                        setBusyId("");
                      }
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <div className="text-sm font-semibold">Edit details</div>
                  <div className="mt-3 grid gap-2">
                    <input
                      className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                      value={d.name}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, [id]: { ...d, name: e.target.value } }))
                      }
                    />
                    <textarea
                      className="min-h-20 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                      value={d.description}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, [id]: { ...d, description: e.target.value } }))
                      }
                    />
                    <button
                      type="button"
                      disabled={isBusy}
                      className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                      onClick={async () => {
                        setError("");
                        setBusyId(id);
                        try {
                          await apiFetch(`/api/admin/projects/${id}`, {
                            method: "PATCH",
                            body: { name: d.name, description: d.description },
                          });
                          await load();
                        } catch (e) {
                          setError(e?.message || "Failed to update project");
                        } finally {
                          setBusyId("");
                        }
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="text-sm font-semibold">Assign employees</div>
                  <div className="mt-2 text-sm text-slate-600">
                    Select who should work on this project.
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {employees.length === 0 ? (
                      <div className="text-sm text-slate-600">No active employees.</div>
                    ) : (
                      employees.map((emp) => {
                        const empId = String(emp._id);
                        const checked = d.assignedEmployeeIds.includes(empId);
                        return (
                          <label key={empId} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const next = e.target.checked
                                  ? [...d.assignedEmployeeIds, empId]
                                  : d.assignedEmployeeIds.filter((x) => x !== empId);
                                setDraft((prev) => ({ ...prev, [id]: { ...d, assignedEmployeeIds: next } }));
                              }}
                            />
                            <span className="text-slate-700">{emp.name}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      disabled={isBusy}
                      className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
                      onClick={async () => {
                        setError("");
                        setBusyId(id);
                        try {
                          // ensure ids exist (avoid stale)
                          const validIds = d.assignedEmployeeIds.filter((x) => employeeById.has(String(x)));
                          await apiFetch(`/api/admin/projects/${id}/assign`, {
                            method: "POST",
                            body: { assignedEmployeeIds: validIds },
                          });
                          await load();
                        } catch (e) {
                          setError(e?.message || "Failed to assign employees");
                        } finally {
                          setBusyId("");
                        }
                      }}
                    >
                      Save assignment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {projects.length === 0 ? (
          <div className="rounded-xl border bg-white p-5 text-sm text-slate-600 shadow-sm">
            No projects yet. Approve a service request to create one.
          </div>
        ) : null}
      </div>
    </div>
  );
}


