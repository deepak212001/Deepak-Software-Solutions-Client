import React from "react";
import { cn } from "./cn.js";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200/70 bg-white/80 shadow-soft backdrop-blur",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("px-6 pt-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <div className={cn("text-sm font-semibold text-slate-900", className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <div className={cn("mt-1 text-sm text-slate-600 leading-relaxed", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("px-6 pb-6 pt-4", className)} {...props} />;
}


