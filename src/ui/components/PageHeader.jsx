import React from "react";
import { cn } from "./cn.js";

export default function PageHeader({ title, subtitle, right, className }) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h1 className="lux-h2">{title}</h1>
        {subtitle ? <p className="lux-subtitle">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}


