import { getServerSession } from "next-auth";

import { Card, CardDescription, CardTitle } from "@workforce/ui";

import { AppIcon } from "../../../../components/app-icon";
import { AppShell } from "../../../../components/app-shell";
import { StatusBadge } from "../../../../components/status-badge";
import { authOptions } from "../../../../lib/auth";
import { getEmployeeHistory } from "../../../../lib/api";
import { formatActionLabel, formatDateTime } from "../../../../lib/formatting";

type HistoryItem = {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  createdAt: string;
};

export default async function EmployeeHistoryPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const history = (await getEmployeeHistory(params.id, session?.user?.token)) as HistoryItem[];

  return (
    <AppShell
      title="Profile history"
      description="Every write action is logged so employees, managers, and admins can understand what changed and when."
    >
      <section className="grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
        <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf7ee] text-[#166534]">
              <AppIcon name="activity" className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black tracking-[-0.05em]">Audit trail basics</CardTitle>
              <CardDescription className="mt-2 text-base">
                This timeline shows the sequence of profile-related actions in plain language, which makes reviews easier for every SESMag persona.
              </CardDescription>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-[1.5rem] bg-[#f7faf6] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Why it matters</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Managers can see what changed, employees can follow decisions, and admins have a reliable record if they need to retrace a workflow later.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[#f7faf6] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tracked actions</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Change submissions, approvals, rejections, and notification actions all show up in the same readable sequence.
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
          <CardTitle className="text-3xl font-black tracking-[-0.05em]">Timeline</CardTitle>
          <CardDescription className="mt-2 text-base">
            The newest actions stay at the top so managers do not have to hunt for the latest state.
          </CardDescription>

          <ol className="mt-8 space-y-4">
            {history.map((item, index) => (
              <li key={String(item.id)} className="relative rounded-[1.75rem] border border-slate-200 bg-[#fafcf9] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#edf7ee] text-sm font-black text-[#166534]">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <StatusBadge label={formatActionLabel(item.action)} />
                      <p className="mt-3 text-base leading-7 text-slate-700">
                        Logged against <span className="font-semibold text-slate-950">{item.entityType.replaceAll("_", " ")}</span> #{item.entityId}.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">{formatDateTime(item.createdAt)}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </section>
    </AppShell>
  );
}
