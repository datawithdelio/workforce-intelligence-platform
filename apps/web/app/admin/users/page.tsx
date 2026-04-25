import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Card, CardDescription, CardTitle } from "@workforce/ui";

import { AppShell } from "../../../components/app-shell";
import { StatusBadge } from "../../../components/status-badge";
import { authOptions } from "../../../lib/auth";
import { getAdminUsers } from "../../../lib/api";
import { formatShortDate } from "../../../lib/formatting";

type AdminUserRow = {
  id: number;
  email: string;
  role: string;
  department?: string | null;
  createdAt: string;
};

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const users = (await getAdminUsers(session?.user?.token)) as AdminUserRow[];
  const roleCounts = users.reduce<Record<string, number>>((accumulator, user) => {
    accumulator[user.role] = (accumulator[user.role] ?? 0) + 1;
    return accumulator;
  }, {});

  return (
    <AppShell
      title="Access control"
      description="Admins can review who has access to the workspace, what role they hold, and which department they are tied to."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total accounts", value: users.length, note: "All tracked sign-ins" },
          { label: "Managers", value: roleCounts.manager ?? 0, note: "Can review requests" },
          { label: "Admins", value: roleCounts.admin ?? 0, note: "Full platform access" }
        ].map((card, index) => (
          <Card
            key={card.label}
            className={index === 0 ? "rounded-[1.9rem] border-[#166534] bg-[#166534] p-5 text-white" : "rounded-[1.9rem] border border-black/5 p-5 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]"}
          >
            <CardDescription className={index === 0 ? "text-white/75" : "text-slate-500"}>{card.label}</CardDescription>
            <CardTitle className={index === 0 ? "mt-4 text-5xl font-black tracking-[-0.08em] text-white" : "mt-4 text-5xl font-black tracking-[-0.08em]"}>
              {card.value}
            </CardTitle>
            <p className={index === 0 ? "mt-3 text-sm text-white/75" : "mt-3 text-sm text-slate-500"}>{card.note}</p>
          </Card>
        ))}
      </section>

      <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
        <CardTitle className="text-3xl font-black tracking-[-0.05em]">Workspace access list</CardTitle>
        <CardDescription className="mt-2 text-base">
          Role labels stay visible and readable on every screen size, which makes access reviews easier and calmer to complete.
        </CardDescription>

        <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200">
          <div className="grid grid-cols-[1.3fr_0.7fr_0.8fr_0.7fr] gap-3 bg-[#f7faf6] px-4 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>Account</span>
            <span>Role</span>
            <span>Department</span>
            <span>Created</span>
          </div>
          <div className="divide-y divide-slate-200 bg-white">
            {users.map((user) => (
              <div key={String(user.id)} className="grid gap-4 px-4 py-4 lg:grid-cols-[1.3fr_0.7fr_0.8fr_0.7fr] lg:items-center">
                <div>
                  <p className="text-base font-semibold text-slate-950">{user.email}</p>
                  <p className="mt-1 text-sm text-slate-500">Account #{user.id}</p>
                </div>
                <div>
                  <StatusBadge label={user.role} />
                </div>
                <p className="text-sm text-slate-700">{user.department ?? "Not assigned"}</p>
                <p className="text-sm text-slate-500">{formatShortDate(user.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
