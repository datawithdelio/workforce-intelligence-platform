import { getServerSession } from "next-auth";

import { Card, CardDescription, CardTitle } from "@workforce/ui";

import { AppShell } from "../../../components/app-shell";
import { StatusBadge } from "../../../components/status-badge";
import { authOptions } from "../../../lib/auth";
import { getScoreSummary } from "../../../lib/api";

export default async function AdminScoresPage() {
  const session = await getServerSession(authOptions);
  const summary = (await getScoreSummary(session?.user?.token)) as {
    total: number;
    distribution: Record<string, number>;
  };

  const distributionRows = Object.entries(summary.distribution);
  const maxCount = Math.max(...distributionRows.map(([, count]) => count), 1);

  return (
    <AppShell
      title="AI signals"
      description="This view summarizes the explainable completion-risk model so admins can understand where profile support is needed without relying on protected attributes."
    >
      <section className="grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
        <Card className="rounded-[2rem] border border-black/5 bg-[radial-gradient(circle_at_top,rgba(82,192,112,0.28),transparent_35%),linear-gradient(160deg,#0f2e1f,#134e36_55%,#0d2f20)] p-6 text-white shadow-[0_35px_90px_-50px_rgba(15,23,42,0.8)]">
          <CardTitle className="text-3xl font-black tracking-[-0.05em] text-white">Completion-risk overview</CardTitle>
          <CardDescription className="mt-2 text-base text-white/75">
            The model highlights who might stay incomplete, using only activity and profile-upkeep signals that can be explained back to a reviewer.
          </CardDescription>

          <div className="mt-6 rounded-[1.75rem] bg-white/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Total scored employees</p>
            <p className="mt-3 text-6xl font-black tracking-[-0.08em]">{summary.total}</p>
            <p className="mt-3 text-sm leading-7 text-white/75">Scores refresh through the analytics pipeline and land in the dashboard-ready table for admins.</p>
          </div>

          <div className="mt-6 space-y-3">
            {[
              "No protected attributes are used.",
              "Risk levels stay explainable in plain English.",
              "Signals guide support, not automatic decisions."
            ].map((item) => (
              <div key={item} className="rounded-[1.5rem] bg-white/10 px-4 py-4 text-sm leading-7 text-white/85">
                {item}
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <section className="grid gap-4 md:grid-cols-3">
            {distributionRows.map(([riskLevel, count]) => (
              <Card
                key={riskLevel}
                className="rounded-[1.9rem] border border-black/5 p-5 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <CardDescription>{riskLevel} risk</CardDescription>
                  <StatusBadge label={riskLevel} />
                </div>
                <CardTitle className="mt-4 text-5xl font-black tracking-[-0.08em]">{count}</CardTitle>
                <p className="mt-3 text-sm text-slate-500">
                  {summary.total ? Math.round((count / summary.total) * 100) : 0}% of scored employees
                </p>
              </Card>
            ))}
          </section>

          <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
            <CardTitle className="text-3xl font-black tracking-[-0.05em]">Risk distribution</CardTitle>
            <CardDescription className="mt-2 text-base">
              Bars make it easy to compare the size of each risk group without hunting through raw numbers.
            </CardDescription>

            <div className="mt-8 space-y-4">
              {distributionRows.map(([riskLevel, count]) => (
                <div key={riskLevel} className="rounded-[1.5rem] border border-slate-200 bg-[#fafcf9] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <StatusBadge label={riskLevel} />
                      <p className="text-base font-semibold text-slate-950">{riskLevel} risk</p>
                    </div>
                    <p className="text-sm text-slate-500">{count} employees</p>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-slate-200">
                    <div
                      className={
                        riskLevel === "high" ? "h-3 rounded-full bg-[#ef4444]" : riskLevel === "medium" ? "h-3 rounded-full bg-[#f59e0b]" : "h-3 rounded-full bg-[#166534]"
                      }
                      style={{ width: `${Math.max(10, (count / maxCount) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
            <CardTitle className="text-3xl font-black tracking-[-0.05em]">What feeds the score</CardTitle>
            <CardDescription className="mt-2 text-base">
              The model stays intentionally lightweight so its reasoning can be explained during an interview or in an admin review.
            </CardDescription>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {[
                "Profile completion score",
                "Days since the latest update",
                "Pending change requests",
                "Approved changes in the last 30 days",
                "Login count in the last 30 days"
              ].map((feature) => (
                <div key={feature} className="rounded-[1.5rem] bg-[#f7faf6] px-4 py-4 text-sm font-semibold text-slate-700">
                  {feature}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
