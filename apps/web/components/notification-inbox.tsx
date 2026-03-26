"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button, Card, CardDescription, CardTitle, cn } from "@workforce/ui";

import { AppIcon } from "./app-icon";
import { StatusBadge } from "./status-badge";
import { formatDateTime } from "../lib/formatting";

type NotificationItem = {
  id: number | string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

function formatTypeLabel(type: string) {
  return type
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function NotificationInbox({
  notifications,
  token
}: {
  notifications: NotificationItem[];
  token?: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState(notifications);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const groupedNotifications = useMemo(
    () => ({
      unread: items.filter((item) => !item.isRead),
      archive: items.filter((item) => item.isRead)
    }),
    [items]
  );

  function markAsRead(id: number | string) {
    if (!token) {
      setMessage("Sign in to update notification status.");
      return;
    }

    startTransition(async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/notifications/${id}/read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        setItems((current) => current.map((item) => (String(item.id) === String(id) ? { ...item, isRead: true } : item)));
        setMessage("Notification marked as read.");
        router.refresh();
        return;
      }

      setMessage("We could not update that notification right now.");
    });
  }

  const sections = [
    {
      title: "New for you",
      description: "Unread reminders, decisions, and nudges stay at the top until you clear them.",
      items: groupedNotifications.unread
    },
    {
      title: "Earlier updates",
      description: "Read items stay visible for audit-friendly follow-up.",
      items: groupedNotifications.archive
    }
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <Card
          key={section.title}
          className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]"
        >
          <CardTitle className="text-2xl font-black tracking-[-0.05em]">{section.title}</CardTitle>
          <CardDescription className="mt-2 text-base">{section.description}</CardDescription>

          <div className="mt-6 space-y-3">
            {section.items.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-[#fafcf9] px-4 py-8 text-center">
                <p className="text-sm font-semibold text-slate-900">Nothing waiting here right now.</p>
                <p className="mt-2 text-sm text-slate-500">When the platform sends reminders or decisions, they will show up here.</p>
              </div>
            ) : (
              section.items.map((notification) => (
                <article
                  key={String(notification.id)}
                  className={cn(
                    "rounded-[1.5rem] border px-4 py-4 transition-colors",
                    notification.isRead ? "border-slate-200 bg-white" : "border-[#d5e8da] bg-[#f7fbf7]"
                  )}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-3">
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                          notification.isRead ? "bg-[#f2f4f1] text-slate-500" : "bg-[#edf7ee] text-[#166534]"
                        )}
                      >
                        <AppIcon
                          name={notification.type.includes("approval") ? "check" : notification.type.includes("reminder") ? "bell" : "mail"}
                          className="h-5 w-5"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge label={notification.isRead ? "Read" : "New message"} />
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            {formatTypeLabel(notification.type)}
                          </span>
                        </div>
                        <p className="mt-3 text-base leading-7 text-slate-700">{notification.message}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <p className="text-sm text-slate-500">{formatDateTime(notification.createdAt)}</p>
                      {!notification.isRead ? (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => markAsRead(notification.id)}
                          disabled={isPending}
                          className="rounded-full border border-slate-200 bg-white px-5"
                        >
                          Mark as read
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </Card>
      ))}

      <p className="text-sm text-slate-600">{message ?? "Inbox language stays simple so the next action is easy to understand."}</p>
    </div>
  );
}
