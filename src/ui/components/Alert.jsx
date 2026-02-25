import React from "react";
import { cn } from "./cn.js";

const styles = {
  info: "border-slate-200/70 bg-white/70 text-slate-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  danger: "border-rose-200 bg-rose-50 text-rose-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
};

export default function Alert({ variant = "info", title, children, className, ...props }) {
  return (
    <div
      className={cn("rounded-2xl border px-4 py-3 text-sm shadow-sm", styles[variant] || styles.info, className)}
      role={variant === "danger" ? "alert" : "status"}
      {...props}
    >
      {title ? <div className="font-semibold">{title}</div> : null}
      {children ? <div className={cn(title ? "mt-1 text-slate-700" : "")}>{children}</div> : null}
    </div>
  );
}


