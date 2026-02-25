import React from "react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Quick links to common areas. (Backend wiring can be added next.)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/employees"
          className="rounded-xl border bg-white p-5 shadow-sm hover:border-slate-300"
        >
          <div className="text-sm font-semibold">Employees</div>
          <div className="mt-1 text-sm text-slate-600">
            View and manage employee records.
          </div>
        </Link>

        <Link
          to="/messages"
          className="rounded-xl border bg-white p-5 shadow-sm hover:border-slate-300"
        >
          <div className="text-sm font-semibold">Messages</div>
          <div className="mt-1 text-sm text-slate-600">
            Inbox / chat messages.
          </div>
        </Link>
      </div>
    </div>
  );
}



