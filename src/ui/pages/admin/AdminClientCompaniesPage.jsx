import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api.js";

export default function AdminClientCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function load() {
    const data = await apiFetch("/api/admin/client-companies");
    setCompanies(data.companies || []);
  }

  useEffect(() => {
    load().catch((e) => setError(e?.message || "Failed to load companies"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Client Companies</h1>
        <p className="mt-2 text-sm text-slate-600">Create companies used by client users and projects.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold">Create company</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input
            className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Company name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Contact email (optional)"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
          <button
            type="button"
            disabled={isSubmitting}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            onClick={async () => {
              setError("");
              setIsSubmitting(true);
              try {
                await apiFetch("/api/admin/client-companies", {
                  method: "POST",
                  body: { name, contactEmail },
                });
                setName("");
                setContactEmail("");
                await load();
              } catch (e) {
                setError(e?.message || "Failed to create company");
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            Create
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold">Companies</div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Contact Email</th>
                <th className="py-2">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {companies.map((c) => (
                <tr key={c._id} className="align-top">
                  <td className="py-2 font-medium">{c.name}</td>
                  <td className="py-2 text-slate-600">{c.contactEmail || "—"}</td>
                  <td className="py-2 text-slate-600">
                    {c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
              {companies.length === 0 ? (
                <tr>
                  <td className="py-6 text-slate-600" colSpan={3}>
                    No companies yet.
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


