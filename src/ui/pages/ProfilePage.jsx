import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider.jsx";
import { apiFetch } from "../../lib/api.js";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const base =
    user?.role === "admin"
      ? "/api/admin/profile"
      : user?.role === "employee"
        ? "/api/employee/profile"
        : "/api/client/profile";

  async function load() {
    const data = await apiFetch(base);
    setProfile(data.profile);
    setName(data.profile?.name || "");
  }

  useEffect(() => {
    if (!user) return;
    load().catch((e) => setError(e?.message || "Failed to load profile"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-2 text-sm text-slate-600">Update your name and password.</p>
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</div>
            <div className="mt-1 text-sm font-medium">{profile?.email || "—"}</div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Role</div>
            <div className="mt-1 text-sm font-medium">{profile?.role || "—"}</div>
          </div>
          {"clientCompany" in (profile || {}) ? (
            <div className="sm:col-span-2">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Client Company</div>
              <div className="mt-1 text-sm font-medium">{profile?.clientCompany || "—"}</div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold">Edit profile</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <div className="text-sm font-medium">Name</div>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block">
            <div className="text-sm font-medium">New password (optional)</div>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Min 6 characters"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="button"
              disabled={isSubmitting}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              onClick={async () => {
                setError("");
                setOk("");
                setIsSubmitting(true);
                try {
                  await apiFetch(base, {
                    method: "PATCH",
                    body: { name: name || undefined, password: password || undefined },
                  });
                  setPassword("");
                  setOk("Saved.");
                  await load();
                  await refresh();
                } catch (e) {
                  setError(e?.message || "Failed to save");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


