import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import Link from "next/link";

import { Card, CardDescription, CardTitle, cn } from "@workforce/ui";

import { AppShell } from "../../components/app-shell";
import { KpiGrid } from "../../components/kpi-grid";
import { StatusBadge } from "../../components/status-badge";
import { authOptions } from "../../lib/auth";
import { getDashboardActivity, getDashboardKpis, getEmployee, getEmployeeHistory } from "../../lib/api";
import { formatDateTime } from "../../lib/formatting";

function formatActionLabel(action: string) {
  return action
    .replaceAll(".", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function summarizeActivity(action: string) {
  if (action.includes("submitted")) {
    return "New change request";
  }

  if (action.includes("approved")) {
    return "Decision recorded";
  }

  if (action.includes("rejected")) {
    return "Request declined";
  }

  if (action.includes("mark_read")) {
    return "Notification cleared";
  }

  return "Audit event";
}

function DashboardActionLink({
  href,
  children,
  tone = "primary"
}: {
  href: string;
  children: ReactNode;
  tone?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
        tone === "primary"
          ? "bg-[#166534] text-white hover:bg-[#14532d]"
          : "border border-[#166534] bg-white text-[#166534] hover:bg-[#edf7ee]"
      )}
    >
      {children}
    </Link>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;
  const role = session?.user?.role;
  const employeeId = session?.user?.employeeId;
  let kpis = (await getDashboardKpis(token)) as {
    totalEmployees: number;
    activeEmployees: number;
    avgCompletionScore: number;
    pendingApprovals: number;
    snapshotDate?: string;
    avgApprovalDays?: number;
    departmentHeadcount?: Record<string, number>;
  } | null;
  let activity = (await getDashboardActivity(token)) as Array<{
    id: number;
    action: string;
    createdAt: string;
  }>;

  if (role === "employee" && employeeId) {
    const employee = (await getEmployee(String(employeeId), token)) as
      | {
          completionScore: number;
          isActive: boolean;
          department: string;
        }
      | null;
    const history = (await getEmployeeHistory(String(employeeId), token)) as Array<{
      id: number;
      action: string;
      createdAt: string;
    }>;

    kpis = {
      totalEmployees: 1,
      activeEmployees: employee?.isActive ? 1 : 0,
      avgCompletionScore: employee?.completionScore ?? 0,
      pendingApprovals: 0,
      snapshotDate: new Date().toISOString().slice(0, 10),
      avgApprovalDays: 0,
      departmentHeadcount: employee?.department ? { [employee.department]: 1 } : {}
    };
    activity = history;
  }

  const safeKpis = kpis ?? {
    totalEmployees: 0,
    activeEmployees: 0,
    avgCompletionScore: 0,
    pendingApprovals: 0,
    snapshotDate: new Date().toISOString().slice(0, 10),
    avgApprovalDays: 0,
    departmentHeadcount: {}
  };

  const departmentRows = Object.entries(safeKpis.departmentHeadcount ?? {})
    .map(([department, count]) => ({ department, count }))
    .sort((left, right) => right.count - left.count);
  const maxDepartmentCount = Math.max(...departmentRows.map((entry) => entry.count), 1);
  const completionPercent = Math.max(0, Math.min(100, Number(safeKpis.avgCompletionScore ?? 0)));
  const gaugeDegrees = Math.max(12, Math.round((completionPercent / 100) * 360));
  const topActivity = activity.slice(0, 4);
  const snapshotDate = safeKpis.snapshotDate ?? "Latest available snapshot";
  const leadingDepartment = departmentRows[0];
  const focusDepartment = departmentRows[1] ?? leadingDepartment;
  const insightHeadline =
    safeKpis.pendingApprovals > 0 ? `${safeKpis.pendingApprovals} profile updates need review.` : "The review queue is clear.";
  const insightBody =
    safeKpis.pendingApprovals > 0
      ? `Profile readiness is ${completionPercent}% and ${leadingDepartment?.department ?? "your top team"} carries the highest headcount.`
      : `Profile readiness is ${completionPercent}% and the platform is ready for the next round of profile updates.`;
  const primaryActionHref = role === "employee" && employeeId ? `/employees/${employeeId}/edit` : "/approvals";
  const primaryActionLabel = role === "employee" ? "Update my profile" : "Open review queue";
  const secondaryActionHref = role === "employee" && employeeId ? `/employees/${employeeId}` : "/employees";
  const secondaryActionLabel = role === "employee" ? "Open my profile" : "Browse people";
  const activityHistoryHref = role === "employee" && employeeId ? `/employees/${employeeId}/history` : "/employees/1/history";
  const queueActionHref = role === "employee" && employeeId ? `/employees/${employeeId}/edit` : "/approvals";
  const queueActionLabel = role === "employee" ? "Submit an update" : "Open approval queue";

  return (
    <AppShell
      title="Dashboard"
      description="Review workforce health, profile completion, recent activity, and the overall approval workload."
    >
      <KpiGrid
        kpis={{
          totalEmployees: safeKpis.totalEmployees,
          activeEmployees: safeKpis.activeEmployees,
          avgCompletionScore: safeKpis.avgCompletionScore,
          pendingApprovals: safeKpis.pendingApprovals
        }}
        role={role}
        employeeId={employeeId}
      />

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="rounded-[2rem] border-0 bg-[radial-gradient(circle_at_top,rgba(82,192,112,0.34),transparent_30%),linear-gradient(155deg,#0d2e1f,#145337_52%,#0a2418)] p-6 text-white shadow-[0_35px_90px_-50px_rgba(15,23,42,0.8)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                Main insight
              </span>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">{insightHeadline}</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/78">{insightBody}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white/10 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Approval time</p>
                <p className="mt-2 text-3xl font-black tracking-[-0.05em]">{safeKpis.avgApprovalDays ?? 0} days</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/10 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Largest team</p>
                <p className="mt-2 text-3xl font-black tracking-[-0.05em]">{leadingDepartment?.department ?? "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <DashboardActionLink href={primaryActionHref}>{primaryActionLabel}</DashboardActionLink>
            <DashboardActionLink href={secondaryActionHref} tone="secondary">
              {secondaryActionLabel}
            </DashboardActionLink>
          </div>
        </Card>

        <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
          <CardTitle className="text-3xl font-black tracking-[-0.05em]">Profile readiness</CardTitle>
          <CardDescription className="mt-2 text-base">A fast read on overall completeness.</CardDescription>

          <div className="mt-7 flex items-center justify-center">
            <div
              className="relative flex h-52 w-52 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#166534 0deg ${gaugeDegrees}deg, #cfe2d4 ${gaugeDegrees}deg 300deg, #e9f0ea 300deg 360deg)`
              }}
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white text-center shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]">
                <p className="text-5xl font-black tracking-[-0.08em] text-slate-950">{completionPercent}%</p>
                <p className="mt-2 text-sm font-medium text-slate-500">Complete</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <div className="rounded-[1.5rem] bg-[#f7faf6] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Daily</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">KPI refresh</p>
            </div>
            <div className="rounded-[1.5rem] bg-[#f7faf6] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Weekly</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">Reminder nudges</p>
            </div>
            <div className="rounded-[1.5rem] bg-[#f7faf6] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">AI signal</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">Explainable scoring</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-black tracking-[-0.05em]">Workforce analytics</CardTitle>
              <CardDescription className="mt-2 max-w-2xl text-base">Headcount by department.</CardDescription>
            </div>
            <span className="rounded-full bg-[#edf7ee] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#166534]">
              Snapshot: {snapshotDate}
            </span>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] bg-[#f7faf6] p-5">
              <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                <span>Departments</span>
                <span>{maxDepartmentCount} max</span>
              </div>
              <div className="space-y-4">
                {departmentRows.map((row, index) => {
                  const width = `${Math.max(18, (row.count / maxDepartmentCount) * 100)}%`;

                  return (
                    <div key={row.department}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">{row.department}</p>
                        <p className="text-sm font-semibold text-slate-500">{row.count}</p>
                      </div>
                      <div className="h-3 rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.05)]">
                        <div
                          className={cn(
                            "h-3 rounded-full",
                            index === 0 ? "bg-[#166534]" : index === 1 ? "bg-[#46a36a]" : "bg-[#9fb9aa]"
                          )}
                          style={{ width }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              {departmentRows.slice(0, 3).map((row, index) => (
                <div key={row.department} className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        {index === 0 ? "Top team" : index === 1 ? "Next up" : "Coverage"}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-950">{row.department}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black tracking-[-0.05em] text-slate-950">{row.count}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tracked employees</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
          <CardTitle className="text-3xl font-black tracking-[-0.05em]">Next best moves</CardTitle>
          <CardDescription className="mt-2 text-base">High-signal actions for today.</CardDescription>

          <div className="mt-8 rounded-[1.75rem] bg-[#f7faf6] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Review queue</p>
            <p className="mt-3 text-5xl font-black tracking-[-0.08em] text-slate-950">{safeKpis.pendingApprovals}</p>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {safeKpis.pendingApprovals > 0 ? "Updates waiting on a decision." : "No requests are waiting."}
            </p>
            <div className="mt-5">
              <DashboardActionLink href={queueActionHref}>{queueActionLabel}</DashboardActionLink>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Turnaround</p>
              <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-slate-950">{safeKpis.avgApprovalDays ?? 0} days</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Focus team</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{focusDepartment?.department ?? "All departments"}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Check lower-completion teams first.</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Automation</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">Daily KPI refresh is live</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4">
        <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-black tracking-[-0.05em]">Recent activity</CardTitle>
              <CardDescription className="mt-2 text-base">Latest workflow events across the platform.</CardDescription>
            </div>
            <Link
              href={activityHistoryHref}
              className="inline-flex min-h-11 items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              History
            </Link>
          </div>

          <ul className="mt-8 grid gap-3 lg:grid-cols-2">
            {topActivity.map((item, index) => (
              <li key={item.id} className="rounded-[1.5rem] border border-slate-200 bg-[#fafcf9] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf7ee] text-sm font-black text-[#166534]">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <StatusBadge label={formatActionLabel(item.action)} />
                      <p className="text-sm text-slate-500">{formatDateTime(item.createdAt)}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{summarizeActivity(item.action)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </AppShell>
  );
}
