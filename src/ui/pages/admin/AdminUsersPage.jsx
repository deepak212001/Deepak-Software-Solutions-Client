import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api.js";

function RolePill({ role }) {
  const cls =
    role === "admin"
      ? "bg-slate-900 text-white"
      : role === "employee"
        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
        : "bg-emerald-50 text-emerald-700 border-emerald-200";
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${cls}`}>{role}</span>;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [roleFilter, setRoleFilter] = useState("employee"); // employee | client | all
  const [error, setError] = useState("");

  // create form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [clientCompanyId, setClientCompanyId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function load() {
    const [u, c] = await Promise.all([
      apiFetch(roleFilter === "all" ? "/api/admin/users" : `/api/admin/users?role=${roleFilter}`),
      apiFetch("/api/admin/client-companies"),
    ]);
    setUsers(u.users || []);
    setCompanies(c.companies || []);
  }

  useEffect(() => {
    setError("");
    load().catch((e) => setError(e?.message || "Failed to load users"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const companyById = useMemo(() => {
    const m = new Map();
    for (const c of companies) m.set(String(c._id), c);
    return m;
  }, [companies]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-2 text-sm text-slate-600">
          Admin can create all other users. “Remove” is implemented as deactivation.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold">Create user</div>
        <div className="mt-3 grid gap-3 md:grid-cols-5">
          <input
            className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 md:col-span-1"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 md:col-span-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 md:col-span-1"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <select
            className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 md:col-span-1"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="employee">Employee</option>
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
          {role === "client" ? (
            <select
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 md:col-span-2"
              value={clientCompanyId}
              onChange={(e) => setClientCompanyId(e.target.value)}
            >
              <option value="">Select client company…</option>
              {companies.map((c) => (
                <option key={c._id} value={String(c._id)}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : null}

          <div className="md:col-span-5">
            <button
              type="button"
              disabled={isSubmitting}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              onClick={async () => {
                setError("");
                setIsSubmitting(true);
                try {
                  await apiFetch("/api/admin/users", {
                    method: "POST",
                    body: {
                      name,
                      email,
                      password,
                      role,
                      clientCompanyId: role === "client" ? clientCompanyId : null,
                    },
                  });
                  setName("");
                  setEmail("");
                  setPassword("");
                  setRole("employee");
                  setClientCompanyId("");
                  await load();
                } catch (e) {
                  setError(e?.message || "Failed to create user");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              Create user
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-semibold">User list</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-600">Filter:</span>
            <select
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="employee">Employees</option>
              <option value="client">Clients</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Client Company</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => {
                const company = u.clientCompany ? companyById.get(String(u.clientCompany)) : null;
                return (
                  <tr key={u._id} className="align-top">
                    <td className="py-2 font-medium">{u.name}</td>
                    <td className="py-2 text-slate-600">{u.email}</td>
                    <td className="py-2">
                      <RolePill role={u.role} />
                    </td>
                    <td className="py-2 text-slate-600">{company?.name || "—"}</td>
                    <td className="py-2 text-slate-600">{u.isActive ? "Active" : "Inactive"}</td>
                    <td className="py-2 text-right">
                      {u.isActive ? (
                        <button
                          type="button"
                          className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                          onClick={async () => {
                            if (!confirm(`Deactivate ${u.name}?`)) return;
                            setError("");
                            try {
                              await apiFetch(`/api/admin/users/${u._id}`, { method: "DELETE" });
                              await load();
                            } catch (e) {
                              setError(e?.message || "Failed to deactivate user");
                            }
                          }}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 ? (
                <tr>
                  <td className="py-6 text-slate-600" colSpan={6}>
                    No users found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


