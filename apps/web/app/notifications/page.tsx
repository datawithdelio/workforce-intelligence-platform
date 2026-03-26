import { getServerSession } from "next-auth";

import { Card, CardDescription, CardTitle } from "@workforce/ui";

import { AppShell } from "../../components/app-shell";
import { NotificationInbox } from "../../components/notification-inbox";
import { authOptions } from "../../lib/auth";
import { getNotifications } from "../../lib/api";

type NotificationItem = {
  id: number;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  const notifications = (await getNotifications(session?.user?.token)) as NotificationItem[];
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  const reminderCount = notifications.filter((notification) => notification.type.includes("reminder")).length;
  const decisionCount = notifications.filter((notification) => notification.type.includes("change_request")).length;

  return (
    <AppShell
      title="Inbox"
      description="Employees and managers get reminders, review decisions, and profile-completion nudges here in plain language."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Unread right now", value: unreadCount, note: "Needs attention" },
          { label: "Reminder nudges", value: reminderCount, note: "Automation-driven" },
          { label: "Approval updates", value: decisionCount, note: "Workflow messages" }
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

      <NotificationInbox notifications={notifications} token={session?.user?.token} />
    </AppShell>
  );
}
