import { getServerSession } from "next-auth";
import Link from "next/link";

import { Card, CardDescription, CardTitle, cn } from "@workforce/ui";

import { AppIcon } from "../../components/app-icon";
import { AppShell } from "../../components/app-shell";
import { StatusBadge } from "../../components/status-badge";
import { authOptions } from "../../lib/auth";
import { getEmployees } from "../../lib/api";
import { formatPercent, formatShortDate } from "../../lib/formatting";

type EmployeeRow = {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  completionScore: number;
  isActive: boolean;
  updatedAt: string;
};

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export default async function EmployeesPage() {
  const session = await getServerSession(authOptions);
  const employees = (await getEmployees(session?.user?.token)) as EmployeeRow[];
  const departments = Array.from(new Set(employees.map((employee) => employee.department)));
  const employeesNeedingSupport = employees.filter((employee) => employee.completionScore < 80);
  const managers = employees.filter((employee) => employee.role === "manager");
  const averageCompletion = employees.length
    ? Math.round(employees.reduce((sum, employee) => sum + employee.completionScore, 0) / employees.length)
    : 0;
  const departmentRows = departments.map((department) => ({
    department,
    count: employees.filter((employee) => employee.department === department).length
  }));

  const summaryCards = [
    {
      label: "People tracked",
      value: employees.length,
      helper: "Live directory"
    },
    {
      label: "Teams covered",
      value: departments.length,
      helper: "Cross-functional view"
    },
    {
      label: "Profiles below target",
      value: employeesNeedingSupport.length,
      helper: "Needs follow-up"
    },
    {
      label: "Average readiness",
      value: formatPercent(averageCompletion),
      helper: "Completion signal"
    }
  ];

  return (
    <AppShell
      title="People directory"
      description="Browse the workforce in one clean view, spot profiles that need support, and jump straight into review-ready employee records."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card, index) => (
          <Card
            key={card.label}
            className={cn(
              "rounded-[1.9rem] border p-5 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]",
              index === 0
                ? "border-[#166534] bg-gradient-to-br from-[#1b7b4d] via-[#145a37] to-[#103722] text-white"
                : "border-black/5 bg-white text-slate-950"
            )}
          >
            <p className={cn("text-sm font-semibold", index === 0 ? "text-white/80" : "text-slate-500")}>{card.label}</p>
            <p className="mt-4 text-5xl font-black tracking-[-0.08em]">{card.value}</p>
            <div
              className={cn(
                "mt-5 inline-flex rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]",
                index === 0 ? "bg-white/10 text-white/80" : "bg-[#eef5ef] text-[#166534]"
              )}
            >
              {card.helper}
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle className="text-3xl font-black tracking-[-0.05em]">People records</CardTitle>
              <CardDescription className="mt-2 max-w-2xl text-base">
                Each row shows role, department, readiness, and the freshest profile update so managers can move fast without losing context.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#edf7ee] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#166534]">
                Private fields stay protected
              </span>
              <span className="rounded-full bg-[#fff4d6] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6500]">
                Built for quick scanning
              </span>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200">
            <div className="grid grid-cols-[1.3fr_0.7fr_0.8fr_0.8fr_0.8fr] gap-3 bg-[#f7faf6] px-4 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <span>Person</span>
              <span>Role</span>
              <span>Department</span>
              <span>Readiness</span>
              <span>Open</span>
            </div>
            <div className="divide-y divide-slate-200 bg-white">
              {employees.map((employee) => (
                <div key={employee.id} className="grid gap-4 px-4 py-4 lg:grid-cols-[1.3fr_0.7fr_0.8fr_0.8fr_0.8fr] lg:items-center">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#edf7ee] text-sm font-black text-[#166534]">
                      {getInitials(employee.firstName, employee.lastName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-slate-950">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="truncate text-sm text-slate-500">
                        {employee.jobTitle} • {employee.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <StatusBadge label={employee.role} />
                    <StatusBadge label={employee.isActive ? "Active employee" : "Not active"} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">{employee.department}</p>
                    <p className="mt-1 text-sm text-slate-500">Updated {formatShortDate(employee.updatedAt)}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">{formatPercent(employee.completionScore)}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        {employee.completionScore >= 80 ? "On track" : "Needs help"}
                      </p>
                    </div>
                    <div className="mt-2 h-2.5 rounded-full bg-slate-200">
                      <div
                        className={cn(
                          "h-2.5 rounded-full",
                          employee.completionScore >= 80 ? "bg-[#166534]" : "bg-[#f59e0b]"
                        )}
                        style={{ width: `${employee.completionScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <Link
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                      href={`/employees/${employee.id}`}
                    >
                      Open profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf7ee] text-[#166534]">
                <AppIcon name="globe" className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black tracking-[-0.05em]">Team coverage</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Each department stays visible so HR and managers can quickly understand where updates are happening.
                </CardDescription>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {departmentRows.map((row, index) => (
                <div key={row.department} className="rounded-[1.5rem] bg-[#f7faf6] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">{row.department}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {index === 0 ? "Primary active team in the directory" : "Tracked inside the same shared workspace"}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)]">
                      {row.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[2rem] border border-black/5 bg-[radial-gradient(circle_at_top,rgba(82,192,112,0.28),transparent_35%),linear-gradient(160deg,#0f2e1f,#134e36_55%,#0d2f20)] p-6 text-white shadow-[0_35px_90px_-50px_rgba(15,23,42,0.8)]">
            <CardTitle className="text-2xl font-black tracking-[-0.05em] text-white">Readiness playbook</CardTitle>
            <CardDescription className="mt-2 text-base text-white/75">
              Focus the next follow-up on the employees who are below target, then route change requests through the review queue.
            </CardDescription>

            <div className="mt-6 space-y-3">
              <div className="rounded-[1.5rem] bg-white/10 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Managers</p>
                <p className="mt-2 text-3xl font-black tracking-[-0.05em]">{managers.length}</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/10 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Profiles needing support</p>
                <p className="mt-2 text-3xl font-black tracking-[-0.05em]">{employeesNeedingSupport.length}</p>
              </div>
            </div>

            <Link
              href="/approvals"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#edf7ee] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Open review queue
            </Link>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
