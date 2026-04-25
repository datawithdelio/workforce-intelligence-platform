import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button, Card, CardDescription, CardTitle, cn } from "@workforce/ui";

import { AppIcon } from "../../../components/app-icon";
import { AppShell } from "../../../components/app-shell";
import { StatusBadge } from "../../../components/status-badge";
import { authOptions } from "../../../lib/auth";
import { getEmployee, getScoreForEmployee } from "../../../lib/api";
import { formatPercent, formatShortDate } from "../../../lib/formatting";

type EmployeeProfile = {
  id: number;
  email?: string;
  role: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  hireDate: string;
  phone?: string;
  address?: string;
  bio: string;
  avatarUrl?: string | null;
  completionScore: number;
  isActive: boolean;
  updatedAt: string;
};

type EngagementScore = {
  riskLevel: string;
  score: number;
  explanation: string;
  scoredAt?: string;
};

export default async function EmployeeProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const employee = (await getEmployee(params.id, session?.user?.token)) as EmployeeProfile | null;
  if (!employee) {
    notFound();
  }
  const canRequestUpdate = session?.user?.role === "employee" && session.user.employeeId === employee.id;
  const canViewScore = session?.user?.role === "admin" || session?.user?.role === "manager";
  const score = canViewScore ? ((await getScoreForEmployee(params.id, session?.user?.token)) as EngagementScore | null) : null;
  const scorePercent = Math.round(Number(score?.score ?? 0) * 100);
  const privateFields = [
    { label: "Phone", value: employee.phone },
    { label: "Address", value: employee.address }
  ].filter((item) => item.value);
  const avatarUrl = employee.avatarUrl?.trim();
  const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();

  return (
    <AppShell
      title={`${employee.firstName} ${employee.lastName}`}
      description="Review the profile snapshot, private details for authorized viewers, and the latest engagement signal in one calm workspace."
    >
      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
          <div className="relative h-72 overflow-hidden rounded-[1.75rem] bg-[#f5f7f2]">
            {avatarUrl ? (
              <Image
                alt={`${employee.firstName} ${employee.lastName} profile picture`}
                fill
                src={avatarUrl}
                unoptimized
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(82,192,112,0.18),transparent_35%),linear-gradient(160deg,#eef6ef,#dfece2_55%,#f7faf6)]">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-3xl font-black tracking-[-0.06em] text-[#166534] shadow-[0_24px_60px_-40px_rgba(22,101,52,0.45)]">
                  {initials}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <StatusBadge label={employee.role} />
            <StatusBadge label={employee.isActive ? "Active employee" : "Not active"} />
            {score ? <StatusBadge label={score.riskLevel} /> : null}
          </div>

          <div className="mt-5">
            <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-950">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="mt-2 text-base text-slate-500">
              {employee.jobTitle} • {employee.department}
            </p>
            <p className="mt-1 text-sm text-slate-500">{employee.email ?? "No public email available"}</p>
          </div>

          <div className="mt-6 rounded-[1.75rem] bg-[#f7faf6] p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Profile completion</p>
                <p className="mt-2 text-5xl font-black tracking-[-0.08em] text-slate-950">
                  {formatPercent(employee.completionScore)}
                </p>
              </div>
              <div className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)]">
                Updated {formatShortDate(employee.updatedAt)}
              </div>
            </div>
            <div className="mt-4 h-3 rounded-full bg-slate-200">
              <div className="h-3 rounded-full bg-[#166534]" style={{ width: `${employee.completionScore}%` }} />
            </div>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Hire date</dt>
              <dd className="mt-2 text-lg font-semibold text-slate-950">{employee.hireDate}</dd>
            </div>
            {score ? (
              <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Latest signal</dt>
                <dd className="mt-2 text-lg font-semibold text-slate-950">{scorePercent}% likelihood profile stays complete</dd>
              </div>
            ) : null}
          </dl>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <CardTitle className="text-3xl font-black tracking-[-0.05em]">Profile overview</CardTitle>
                <CardDescription className="mt-2 max-w-2xl text-base">
                  Public profile fields stay visible across the workspace, while private details remain restricted to the employee and admins.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3">
                {canRequestUpdate ? (
                  <Link href={`/employees/${params.id}/edit`}>
                    <Button className="rounded-full bg-[#166534] px-6 hover:bg-[#14532d]">Request an update</Button>
                  </Link>
                ) : null}
                <Link href={`/employees/${params.id}/history`}>
                  <Button variant="secondary" className="rounded-full border border-slate-200 bg-white px-6">
                    View history
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[1.75rem] bg-[#f7faf6] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Public summary</p>
                <p className="mt-4 text-lg leading-8 text-slate-700">{employee.bio}</p>
              </div>

              <div className="space-y-3">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf7ee] text-[#166534]">
                      <AppIcon name="profile" className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Role and team</p>
                      <p className="mt-1 text-lg font-semibold text-slate-950">
                        {employee.role} • {employee.department}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff4d6] text-[#9a6500]">
                      <AppIcon name="shield" className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Privacy handling</p>
                      <p className="mt-1 text-lg font-semibold text-slate-950">Private fields only show for authorized viewers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <section className={cn("grid gap-4", score ? "lg:grid-cols-2" : "lg:grid-cols-1")}>
            <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
              <CardTitle className="text-2xl font-black tracking-[-0.05em]">Private details</CardTitle>
              <CardDescription className="mt-2 text-base">
                These fields stay hidden from other employees and are only returned to the right role.
              </CardDescription>

              <div className="mt-6 space-y-3">
                {privateFields.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-[#fafcf9] px-4 py-8 text-center">
                    <p className="text-sm font-semibold text-slate-900">No private fields were returned for this view.</p>
                    <p className="mt-2 text-sm text-slate-500">That is expected when the signed-in role is not allowed to see them.</p>
                  </div>
                ) : (
                  privateFields.map((field) => (
                    <div key={field.label} className="rounded-[1.5rem] bg-[#f7faf6] px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{field.label}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">{field.value}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {score ? (
              <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-black tracking-[-0.05em]">AI completion signal</CardTitle>
                    <CardDescription className="mt-2 text-base">
                      This is a lightweight decision-support score based on profile upkeep and recent activity, not protected traits.
                    </CardDescription>
                  </div>
                  <StatusBadge label={score.riskLevel} />
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-[1.75rem] bg-[#f7faf6] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Signal confidence</p>
                    <p className="mt-3 text-5xl font-black tracking-[-0.08em] text-slate-950">{scorePercent}%</p>
                    <div className="mt-4 h-3 rounded-full bg-slate-200">
                      <div
                        className={cn(
                          "h-3 rounded-full",
                          score.riskLevel === "high"
                            ? "bg-[#ef4444]"
                            : score.riskLevel === "medium"
                              ? "bg-[#f59e0b]"
                              : "bg-[#166534]"
                        )}
                        style={{ width: `${Math.max(scorePercent, 8)}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Plain-English explanation</p>
                    <p className="mt-3 text-base leading-7 text-slate-700">{score.explanation}</p>
                    <p className="mt-3 text-sm text-slate-500">
                      {score.scoredAt ? `Scored ${formatShortDate(score.scoredAt)}` : "Scored during the latest pipeline run"}
                    </p>
                  </div>
                </div>
              </Card>
            ) : null}
          </section>
        </div>
      </section>
    </AppShell>
  );
}
