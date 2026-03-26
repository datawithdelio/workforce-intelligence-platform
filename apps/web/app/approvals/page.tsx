import { getServerSession } from "next-auth";
import Link from "next/link";

import { Card, CardDescription, CardTitle } from "@workforce/ui";

import { AppIcon } from "../../components/app-icon";
import { AppShell } from "../../components/app-shell";
import { StatusBadge } from "../../components/status-badge";
import { authOptions } from "../../lib/auth";
import { getChangeRequests } from "../../lib/api";
import { formatDateTime } from "../../lib/formatting";

type ChangeRequestRow = {
  id: number;
  employeeId: number;
  fieldName: string;
  oldValue: string;
  newValue: string;
  status: string;
  requestedAt: string;
  firstName: string;
  lastName: string;
  department: string;
};

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions);
  const requests = (await getChangeRequests(session?.user?.token)) as ChangeRequestRow[];
  const uniqueDepartments = new Set(requests.map((request) => request.department)).size;
  const fieldsChanged = new Set(requests.map((request) => request.fieldName)).size;

  const summaryCards = [
    { label: "Waiting for review", value: requests.length, helper: "Manager queue" },
    { label: "Departments affected", value: uniqueDepartments, helper: "Cross-team changes" },
    { label: "Field types in queue", value: fieldsChanged, helper: "Profile coverage" }
  ];

  return (
    <AppShell
      title="Review queue"
      description="Managers review employee-submitted changes here, compare the old and new values quickly, and keep the directory trustworthy."
    >
      <section className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
        <Card className="rounded-[2rem] border border-black/5 bg-[radial-gradient(circle_at_top,rgba(82,192,112,0.28),transparent_35%),linear-gradient(160deg,#0f2e1f,#134e36_55%,#0d2f20)] p-6 text-white shadow-[0_35px_90px_-50px_rgba(15,23,42,0.8)]">
          <CardTitle className="text-3xl font-black tracking-[-0.05em] text-white">Keep decisions moving</CardTitle>
          <CardDescription className="mt-2 text-base text-white/75">
            Large actions, plain language, and clear before-and-after comparisons make the review flow easier to use under pressure.
          </CardDescription>

          <div className="mt-6 grid gap-3">
            {summaryCards.map((card) => (
              <div key={card.label} className="rounded-[1.5rem] bg-white/10 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">{card.label}</p>
                <p className="mt-2 text-4xl font-black tracking-[-0.06em]">{card.value}</p>
                <p className="mt-2 text-sm text-white/75">{card.helper}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle className="text-3xl font-black tracking-[-0.05em]">Open requests</CardTitle>
              <CardDescription className="mt-2 max-w-2xl text-base">
                Every request shows who submitted it, what field changed, and the values side by side so the next step is obvious.
              </CardDescription>
            </div>
            <span className="rounded-full bg-[#fff4d6] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6500]">
              Text and icon, never color only
            </span>
          </div>

          <div className="mt-8 grid gap-4">
            {requests.map((request) => (
              <article key={String(request.id)} className="rounded-[1.75rem] border border-slate-200 bg-[#fafcf9] p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge label="Waiting for manager review" />
                      <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)]">
                        {request.department}
                      </span>
                    </div>
                    <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-slate-950">
                      {request.firstName} {request.lastName}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Requested {formatDateTime(request.requestedAt)} • Field changed: {request.fieldName}
                    </p>
                  </div>

                  <Link
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#166534] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#14532d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                    href={`/approvals/${request.id}`}
                  >
                    Open review
                  </Link>
                </div>

                <div className="mt-6 grid gap-3 lg:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
                    <div className="flex items-center gap-2">
                      <AppIcon name="clock" className="h-4 w-4 text-slate-400" />
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Current value</p>
                    </div>
                    <p className="mt-3 text-base leading-7 text-slate-700">{request.oldValue}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-[#d5e8da] bg-[#f7fbf7] px-4 py-4">
                    <div className="flex items-center gap-2">
                      <AppIcon name="check" className="h-4 w-4 text-[#166534]" />
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#166534]">Requested value</p>
                    </div>
                    <p className="mt-3 text-base leading-7 text-slate-700">{request.newValue}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
