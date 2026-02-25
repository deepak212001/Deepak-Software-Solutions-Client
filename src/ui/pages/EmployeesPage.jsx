import React from "react";

export default function EmployeesPage() {
  // TODO: wire to server endpoints in `server/src/routes/employeeRoutes.js`
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Employees</h1>
        <p className="mt-2 text-sm text-slate-600">
          Employee list UI (placeholder). Next step: fetch and render real data.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">Coming soon</div>
            <div className="mt-1 text-sm text-slate-600">
              Add: table, search, filters, create/edit actions.
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            onClick={() => alert("Hook this up to 'Create employee' flow.")}
          >
            + Add employee
          </button>
        </div>
      </div>
    </div>
  );
}



