import React from "react";
import { cn } from "./cn.js";

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-soft transition " +
  "focus:outline-none focus:ring-4 disabled:pointer-events-none disabled:opacity-60";

const variants = {
  primary:
    "bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 focus:ring-slate-200",
  gold:
    "bg-gradient-to-r from-gold-500 to-gold-300 text-slate-900 hover:from-gold-400 hover:to-gold-200 focus:ring-gold-200",
  royal:
    "bg-gradient-to-r from-royal-700 to-royal-500 text-white hover:from-royal-600 hover:to-royal-400 focus:ring-royal-200",
  emerald:
    "bg-gradient-to-r from-emerald-700 to-emerald-500 text-white hover:from-emerald-600 hover:to-emerald-400 focus:ring-emerald-200",
  outline:
    "border border-slate-200 bg-white/70 text-slate-900 backdrop-blur hover:bg-white focus:ring-slate-200",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-200",
  danger: "bg-gradient-to-r from-rose-700 to-rose-500 text-white hover:from-rose-600 hover:to-rose-400 focus:ring-rose-200",
};

const sizes = {
  sm: "px-3 py-2 text-xs rounded-xl",
  md: "px-4 py-2.5 text-sm rounded-2xl",
  lg: "px-5 py-3 text-sm rounded-2xl",
};

export default function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  return (
    <Comp
      className={cn(base, sizes[size] || sizes.md, variants[variant] || variants.primary, className)}
      {...props}
    />
  );
}


