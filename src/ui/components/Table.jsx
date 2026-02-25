import React from "react";
import { cn } from "./cn.js";

export function TableShell({ className, ...props }) {
  return <div className={cn("overflow-x-auto", className)} {...props} />;
}

export function Table({ className, ...props }) {
  return <table className={cn("min-w-full text-left text-sm", className)} {...props} />;
}

export function THead({ className, ...props }) {
  return <thead className={cn("text-xs font-semibold uppercase tracking-wide text-slate-500", className)} {...props} />;
}

export function TBody({ className, ...props }) {
  return <tbody className={cn("divide-y divide-slate-100", className)} {...props} />;
}

export function Th({ className, ...props }) {
  return <th className={cn("py-2.5 pr-4", className)} {...props} />;
}

export function Td({ className, ...props }) {
  return <td className={cn("py-2.5 pr-4 align-top", className)} {...props} />;
}


