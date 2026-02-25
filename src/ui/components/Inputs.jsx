import React from "react";
import { cn } from "./cn.js";

const base =
  "w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm backdrop-blur " +
  "placeholder:text-slate-400 outline-none transition " +
  "focus:border-slate-300 focus:ring-4 focus:ring-royal-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70";

export function Input({ className, ...props }) {
  return <input className={cn(base, className)} {...props} />;
}

export function Select({ className, ...props }) {
  return <select className={cn(base, "pr-8", className)} {...props} />;
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn(base, "min-h-28 resize-y", className)} {...props} />;
}

export function Field({ label, hint, error, className, children }) {
  return (
    <label className={cn("block", className)}>
      {label ? <div className="text-sm font-medium text-slate-900">{label}</div> : null}
      <div className={cn(label ? "mt-1.5" : "")}>{children}</div>
      {error ? <div className="mt-1 text-xs text-rose-700">{error}</div> : null}
      {!error && hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </label>
  );
}


