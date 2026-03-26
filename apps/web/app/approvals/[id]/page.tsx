import { getServerSession } from "next-auth";

import { Card, CardDescription, CardTitle } from "@workforce/ui";

import { AppIcon } from "../../../components/app-icon";
import { AppShell } from "../../../components/app-shell";
import { ApprovalReviewForm } from "../../../components/approval-review-form";
import { StatusBadge } from "../../../components/status-badge";
import { authOptions } from "../../../lib/auth";
import { getChangeRequest } from "../../../lib/api";
import { formatDateTime } from "../../../lib/formatting";

type ChangeRequestDetail = {
  id: number;
  fieldName: string;
  oldValue: string;
  newValue: string;
  status: string;
  requestedAt: string;
  notes?: string | null;
  firstName: string;
  lastName: string;
  department: string;
};

export default async function ApprovalDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const request = (await getChangeRequest(params.id, session?.user?.token)) as ChangeRequestDetail;

  return (
    <AppShell
      title="Review request"
      description="Compare the current value with the requested update, then make a decision that stays visible in the audit trail."
    >
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge label={request.status === "pending" ? "Waiting for manager review" : request.status} />
                  <span className="rounded-full bg-[#edf7ee] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#166534]">
                    {request.department}
                  </span>
                </div>
                <CardTitle className="mt-4 text-3xl font-black tracking-[-0.05em]">
                  {request.firstName} {request.lastName}
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  Requested {formatDateTime(request.requestedAt)} • Field changed: {request.fieldName}
                </CardDescription>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-[#f8faf7] px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Review ID</p>
                <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-slate-950">#{request.id}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2">
                  <AppIcon name="clock" className="h-4 w-4 text-slate-400" />
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Current value</p>
                </div>
                <p className="mt-4 text-base leading-7 text-slate-700">{request.oldValue}</p>
              </div>

              <div className="rounded-[1.75rem] border border-[#d5e8da] bg-[#f7fbf7] p-5">
                <div className="flex items-center gap-2">
                  <AppIcon name="arrow" className="h-4 w-4 text-[#166534]" />
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#166534]">Requested value</p>
                </div>
                <p className="mt-4 text-base leading-7 text-slate-700">{request.newValue}</p>
              </div>
            </div>
          </Card>

          <ApprovalReviewForm requestId={request.id} token={session?.user?.token} status={request.status} />
        </div>

        <div className="space-y-4">
          <Card className="rounded-[2rem] border border-black/5 bg-[radial-gradient(circle_at_top,rgba(82,192,112,0.28),transparent_35%),linear-gradient(160deg,#0f2e1f,#134e36_55%,#0d2f20)] p-6 text-white shadow-[0_35px_90px_-50px_rgba(15,23,42,0.8)]">
            <CardTitle className="text-2xl font-black tracking-[-0.05em] text-white">Low-friction review</CardTitle>
            <CardDescription className="mt-2 text-base text-white/75">
              The page keeps the decision path short: status, before, after, and reviewer notes all stay visible together.
            </CardDescription>

            <div className="mt-6 space-y-3">
              {[
                "Read the old and new value side by side.",
                "Add a note if the employee needs more context.",
                "Approve or reject without leaving the page."
              ].map((step) => (
                <div key={step} className="rounded-[1.5rem] bg-white/10 px-4 py-4 text-sm leading-7 text-white/85">
                  {step}
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
            <CardTitle className="text-2xl font-black tracking-[-0.05em]">Trust and compliance notes</CardTitle>
            <CardDescription className="mt-2 text-base">
              Decisions stay auditable, and private fields never leak into the wrong employee view.
            </CardDescription>

            <div className="mt-6 space-y-3">
              <div className="rounded-[1.5rem] bg-[#f7faf6] px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">Audit logging</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">Approval and rejection events are written to the history trail automatically.</p>
              </div>
              <div className="rounded-[1.5rem] bg-[#f7faf6] px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">Plain language</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">Labels use clear wording like “Waiting for manager review” instead of unexplained status codes.</p>
              </div>
              {request.notes ? (
                <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4">
                  <p className="text-sm font-semibold text-slate-900">Existing note</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{request.notes}</p>
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
