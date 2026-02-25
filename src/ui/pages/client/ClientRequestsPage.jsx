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

export default function ClientRequestsPage() {
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function load() {
    const [s, r] = await Promise.all([
      apiFetch("/api/client/services"),
      apiFetch("/api/client/service-requests"),
    ]);
    setServices(s.services || []);
    setRequests(r.requests || []);
  }

  useEffect(() => {
    load().catch((e) => setError(e?.message || "Failed to load"));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Request a Service</h1>
        <p className="mt-2 text-sm text-slate-600">
          Submit a service request. Admin approval will create a project.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      {ok ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {ok}
        </div>
      ) : null}

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold">New request</div>
        <div className="mt-3 grid gap-3">
          <select
            className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            <option value="">Select service…</option>
            {services.map((s) => (
              <option key={s._id} value={String(s._id)}>
                {s.name}
              </option>
            ))}
          </select>
          <textarea
            className="min-h-24 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Details (optional)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <button
            type="button"
            disabled={isSubmitting}
            className="w-fit rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            onClick={async () => {
              setError("");
              setOk("");
              setIsSubmitting(true);
              try {
                await apiFetch("/api/client/service-requests", {
                  method: "POST",
                  body: { serviceId, details: details || undefined },
                });
                setServiceId("");
                setDetails("");
                setOk("Request submitted.");
                await load();
              } catch (e) {
                setError(e?.message || "Failed to create request");
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            Submit request
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold">My requests</div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2">Service</th>
                <th className="py-2">Status</th>
                <th className="py-2">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.map((r) => (
                <tr key={r._id} className="align-top">
                  <td className="py-2 font-medium">{r.service?.name || "—"}</td>
                  <td className="py-2">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="py-2 text-slate-600">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
              {requests.length === 0 ? (
                <tr>
                  <td className="py-6 text-slate-600" colSpan={3}>
                    No requests yet.
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


