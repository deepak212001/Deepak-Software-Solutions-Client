import React from "react";
import { cn } from "./cn.js";

const variants = {
  slate: "border-slate-200 bg-slate-50 text-slate-700",
  royal: "border-royal-200 bg-royal-50 text-royal-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  gold: "border-gold-200 bg-gold-100 text-slate-900",
  solid: "border-slate-900 bg-slate-900 text-white",
};

export default function Badge({ variant = "slate", className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
        variants[variant] || variants.slate,
        className
      )}
      {...props}
    />
  );
}


