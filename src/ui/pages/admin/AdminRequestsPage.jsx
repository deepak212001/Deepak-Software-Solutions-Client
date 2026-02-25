import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api.js";

function StatusPill({ status }) {
  const cls =
    status === "pending"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : status === "approved"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-rose-50 text-rose-700 border-rose-200";
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${cls}`}>
      {status}
    </span>
  );
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const [draft, setDraft] = useState({}); // id -> {projectName, projectDescription, assignedEmployeeIds, rejectReason}

  async function load() {
    const [r, e] = await Promise.all([
      apiFetch("/api/admin/service-requests"),
      apiFetch("/api/admin/users?role=employee"),
    ]);
    setRequests(r.requests || []);
    setEmployees((e.users || []).filter((u) => u.isActive));
  }

  useEffect(() => {
    load().catch((e) => setError(e?.message || "Failed to load requests"));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Service Requests</h1>
        <p className="mt-2 text-sm text-slate-600">
          Client requests a service → admin approves → project is created.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        {requests.map((r) => {
          const d = draft[String(r._id)] || {
            projectName: "",
            projectDescription: "",
            assignedEmployeeIds: [],
            rejectReason: "",
          };
          const isBusy = busyId === String(r._id);
          const canAct = r.status === "pending";

          return (
            <div key={r._id} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold">{r.service?.name || "Service"}</div>
                    <StatusPill status={r.status} />
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    <span className="font-medium text-slate-900">{r.clientCompany?.name || "—"}</span>{" "}
                    • requested by {r.clientUser?.name || "—"} ({r.clientUser?.email || "—"})
                  </div>
                  {r.details ? (
                    <div className="mt-2 rounded-lg border bg-slate-50 p-3 text-sm text-slate-700">
                      {r.details}
                    </div>
                  ) : null}
                  <div className="mt-2 text-xs text-slate-500">
                    Created: {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                  </div>
                  {r.status === "rejected" && r.rejectedReason ? (
                    <div className="mt-2 text-sm text-rose-700">Rejected reason: {r.rejectedReason}</div>
                  ) : null}
                </div>
              </div>

              {canAct ? (
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border p-4">
                    <div className="text-sm font-semibold">Approve → create project</div>
                    <div className="mt-3 grid gap-2">
                      <input
                        className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder="Project name (optional)"
                        value={d.projectName}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            [String(r._id)]: { ...d, projectName: e.target.value },
                          }))
                        }
                      />
                      <textarea
                        className="min-h-20 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder="Project description (optional)"
                        value={d.projectDescription}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            [String(r._id)]: { ...d, projectDescription: e.target.value },
                          }))
                        }
                      />
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Assign employees (optional)
                        </div>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          {employees.length === 0 ? (
                            <div className="text-sm text-slate-600">No active employees.</div>
                          ) : (
                            employees.map((emp) => {
                              const id = String(emp._id);
                              const checked = d.assignedEmployeeIds.includes(id);
                              return (
                                <label key={id} className="flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => {
                                      const next = e.target.checked
                                        ? [...d.assignedEmployeeIds, id]
                                        : d.assignedEmployeeIds.filter((x) => x !== id);
                                      setDraft((prev) => ({
                                        ...prev,
                                        [String(r._id)]: { ...d, assignedEmployeeIds: next },
                                      }));
                                    }}
                                  />
                                  <span className="text-slate-700">{emp.name}</span>
                                </label>
                              );
                            })
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={isBusy}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
                        onClick={async () => {
                          setError("");
                          setBusyId(String(r._id));
                          try {
                            await apiFetch(`/api/admin/service-requests/${r._id}/approve`, {
                              method: "POST",
                              body: {
                                projectName: d.projectName || undefined,
                                projectDescription: d.projectDescription || undefined,
                                assignedEmployeeIds: d.assignedEmployeeIds,
                              },
                            });
                            await load();
                          } catch (e) {
                            setError(e?.message || "Failed to approve request");
                          } finally {
                            setBusyId("");
                          }
                        }}
                      >
                        Approve
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border p-4">
                    <div className="text-sm font-semibold">Reject</div>
                    <div className="mt-3 grid gap-2">
                      <textarea
                        className="min-h-20 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder="Reason (optional)"
                        value={d.rejectReason}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            [String(r._id)]: { ...d, rejectReason: e.target.value },
                          }))
                        }
                      />
                      <button
                        type="button"
                        disabled={isBusy}
                        className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-60"
                        onClick={async () => {
                          if (!confirm("Reject this request?")) return;
                          setError("");
                          setBusyId(String(r._id));
                          try {
                            await apiFetch(`/api/admin/service-requests/${r._id}/reject`, {
                              method: "POST",
                              body: { reason: d.rejectReason || undefined },
                            });
                            await load();
                          } catch (e) {
                            setError(e?.message || "Failed to reject request");
                          } finally {
                            setBusyId("");
                          }
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-slate-600">
                  {r.status === "approved" ? "Approved." : "Rejected."}
                </div>
              )}
            </div>
          );
        })}

        {requests.length === 0 ? (
          <div className="rounded-xl border bg-white p-5 text-sm text-slate-600 shadow-sm">
            No requests yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}


