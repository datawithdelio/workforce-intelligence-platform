import React from "react";
import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "../lib/utils";

export function Badge({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLSpanElement>>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
