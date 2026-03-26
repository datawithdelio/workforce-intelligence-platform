import React from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "../lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
        className
      )}
      {...props}
    />
  );
}
