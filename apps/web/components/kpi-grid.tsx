import React from "react";
import Link from "next/link";
import { cn } from "@workforce/ui";

export function KpiGrid({
  kpis,
  role,
  employeeId
}: {
  kpis: {
    totalEmployees: number;
    activeEmployees: number;
    avgCompletionScore: number;
    pendingApprovals: number;
  };
  role?: "employee" | "manager" | "admin";
  employeeId?: number | null;
}) {
  const items = [
    {
      label: "Total employees",
      value: kpis.totalEmployees,
      note: "People currently tracked in the workforce system",
      helper: "Live workforce",
      tone: "accent",
      href: role === "employee" && employeeId ? `/employees/${employeeId}` : "/employees"
    },
    {
      label: "Active employees",
      value: kpis.activeEmployees,
      note: "Employees marked active right now",
      helper: "Operational headcount",
      tone: "neutral",
      href: role === "employee" && employeeId ? `/employees/${employeeId}` : "/employees"
    },
    {
      label: "Average profile completion",
      value: `${kpis.avgCompletionScore}%`,
      note: "How complete employee profiles are on average",
      helper: "Readiness signal",
      tone: "neutral",
      href: role === "employee" && employeeId ? `/employees/${employeeId}/history` : "/dashboard"
    },
    {
      label: "Waiting for manager review",
      value: kpis.pendingApprovals,
      note: "Submitted profile updates that still need a decision",
      helper: "Review queue",
      tone: "neutral",
      href: role === "employee" && employeeId ? `/employees/${employeeId}/edit` : "/approvals"
    }
  ] as const;

  return (
    <section aria-label="Key performance indicators" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className={cn(
            "rounded-[1.9rem] border p-5 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]",
            item.tone === "accent"
              ? "border-[#166534] bg-gradient-to-br from-[#1b7b4d] via-[#145a37] to-[#103722] text-white"
              : "border-black/5 bg-white text-slate-950"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={cn("text-sm font-semibold", item.tone === "accent" ? "text-white/85" : "text-slate-500")}>
                {item.label}
              </p>
              <p className="mt-5 text-5xl font-black tracking-[-0.08em]">{item.value}</p>
            </div>
            <Link
              href={item.href}
              aria-label={`Open ${item.label}`}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full border text-lg font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
                item.tone === "accent"
                  ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                  : "border-slate-200 bg-[#f7f9f6] text-slate-800 hover:border-slate-950 hover:text-slate-950"
              )}
            >
              ↗
            </Link>
          </div>
          <p className={cn("mt-4 text-sm leading-6", item.tone === "accent" ? "text-white/80" : "text-slate-500")}>
            {item.note}
          </p>
          <div
            className={cn(
              "mt-5 inline-flex min-h-9 items-center rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]",
              item.tone === "accent"
                ? "bg-white/10 text-white/80"
                : "bg-[#eef5ef] text-[#166534]"
            )}
          >
            {item.helper}
          </div>
        </article>
      ))}
    </section>
  );
}
