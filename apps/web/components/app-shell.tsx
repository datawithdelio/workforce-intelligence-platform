"use client";

import { useEffect, useState, type PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { cn } from "@workforce/ui";
import { AppIcon, type IconName } from "./app-icon";

type NavItem = {
  href: string;
  label: string;
  icon: IconName;
};

function getNavGroups(role: string | undefined, employeeId: number | null | undefined): Array<{ label: string; items: NavItem[] }> {
  if (role === "employee") {
    return [
      {
        label: "Workspace",
        items: [
          { href: "/dashboard", label: "Overview", icon: "dashboard" },
          ...(employeeId ? [{ href: `/employees/${employeeId}`, label: "My profile", icon: "employees" as const }] : []),
          { href: "/notifications", label: "Inbox", icon: "notifications" }
        ]
      }
    ];
  }

  return [
    {
      label: "Platform",
      items: [
        { href: "/dashboard", label: "Overview", icon: "dashboard" },
        { href: "/employees", label: "People", icon: "employees" },
        { href: "/approvals", label: "Review queue", icon: "approvals" },
        { href: "/notifications", label: "Inbox", icon: "notifications" }
      ]
    },
    {
      label: "Intelligence",
      items: [
        { href: "/admin/users", label: "Access", icon: "users" },
        { href: "/admin/scores", label: "AI signals", icon: "scores" }
      ]
    }
  ];
}

function isLinkActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function formatDisplayName(email: string | undefined, firstName?: string | null, lastName?: string | null) {
  const explicitName = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (explicitName) {
    return explicitName;
  }

  if (!email) {
    return "Team member";
  }

  const localPart = email.split("@")[0] ?? "";
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatWorkspaceLabel(role: string | undefined) {
  if (!role) {
    return "PeopleOps workspace";
  }

  return `${role.charAt(0).toUpperCase()}${role.slice(1)} workspace`;
}

export function AppShell({
  children,
  title,
  description
}: PropsWithChildren<{ title: string; description: string }>) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [pendingApprovals, setPendingApprovals] = useState<number>(0);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const displayName = formatDisplayName(session?.user?.email, session?.user?.firstName, session?.user?.lastName);
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item.charAt(0))
    .join("")
    .toUpperCase();
  const roleLabel = formatWorkspaceLabel(session?.user?.role);
  const navGroups = getNavGroups(session?.user?.role, session?.user?.employeeId);
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date());
  const roleName = session?.user?.role ? `${session.user.role.charAt(0).toUpperCase()}${session.user.role.slice(1)}` : "Member";

  useEffect(() => {
    async function loadPendingApprovals() {
      if (!session?.user?.token || !session.user.role || session.user.role === "employee") {
        setPendingApprovals(0);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/dashboard/kpis`,
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`
            },
            cache: "no-store"
          }
        );

        if (!response.ok) {
          setPendingApprovals(0);
          return;
        }

        const payload = (await response.json()) as { pendingApprovals?: number };
        setPendingApprovals(payload.pendingApprovals ?? 0);
      } catch (_error) {
        setPendingApprovals(0);
      }
    }

    void loadPendingApprovals();
  }, [pathname, session?.user?.role, session?.user?.token]);

  useEffect(() => {
    async function loadUnreadNotifications() {
      if (!session?.user?.token) {
        setUnreadNotifications(0);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/notifications`,
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`
            },
            cache: "no-store"
          }
        );

        if (!response.ok) {
          setUnreadNotifications(0);
          return;
        }

        const payload = (await response.json()) as Array<{ isRead?: boolean }>;
        setUnreadNotifications(payload.filter((notification) => !notification.isRead).length);
      } catch (_error) {
        setUnreadNotifications(0);
      }
    }

    void loadUnreadNotifications();
  }, [pathname, session?.user?.token]);

  return (
    <div className="min-h-screen bg-[#edf1ea] text-slate-950">
      <div className="mx-auto max-w-[1560px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[290px_1fr] xl:grid-cols-[304px_1fr]">
          <aside className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-hidden">
            <div className="flex items-center gap-3 rounded-[1.5rem] bg-[#f5f7f2] px-3 py-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f6ea] text-[#17633f]">
                <AppIcon name="spark" className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-black tracking-[-0.05em] text-slate-950">workforce.</p>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Done right</p>
              </div>
            </div>

            <div className="mt-8 space-y-7">
              {navGroups.map((group) => (
                <section key={group.label}>
                  <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{group.label}</p>
                  <nav aria-label={group.label} className="mt-3 space-y-1.5">
                    {group.items.map((item) => {
                      const active = isLinkActive(pathname, item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex min-h-11 items-center gap-3 rounded-[1.25rem] px-3 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
                            active
                              ? "bg-[#166534] text-white shadow-[0_24px_60px_-40px_rgba(22,101,52,0.8)]"
                              : "text-slate-600 hover:bg-[#f5f7f2] hover:text-slate-950"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full",
                              active ? "bg-white/12 text-white" : "bg-[#f1f4ef] text-slate-500"
                            )}
                          >
                            <AppIcon name={item.icon} className="h-5 w-5" />
                          </span>
                          <span>{item.label}</span>
                          {item.href === "/approvals" && pendingApprovals > 0 ? (
                            <span
                              className={cn(
                                "ml-auto inline-flex min-w-7 items-center justify-center rounded-full px-2 py-1 text-xs font-bold leading-none",
                                active ? "bg-white text-[#166534]" : "bg-[#c73643] text-white"
                              )}
                              aria-label={`${pendingApprovals} pending approval${pendingApprovals === 1 ? "" : "s"}`}
                            >
                              {pendingApprovals}
                            </span>
                          ) : null}
                          {item.href === "/notifications" && unreadNotifications > 0 ? (
                            <span
                              className={cn(
                                "ml-auto inline-flex min-w-7 items-center justify-center rounded-full px-2 py-1 text-xs font-bold leading-none",
                                active ? "bg-white text-[#166534]" : "bg-[#c73643] text-white"
                              )}
                              aria-label={`${unreadNotifications} unread notification${unreadNotifications === 1 ? "" : "s"}`}
                            >
                              {unreadNotifications}
                            </span>
                          ) : null}
                        </Link>
                      );
                    })}
                  </nav>
                </section>
              ))}
            </div>

            <div className="mt-8 rounded-[1.75rem] bg-[radial-gradient(circle_at_top,rgba(82,192,112,0.28),transparent_35%),linear-gradient(160deg,#0f2e1f,#134e36_55%,#0d2f20)] p-5 text-white shadow-[0_35px_90px_-50px_rgba(15,23,42,0.8)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Automation center</p>
              <p className="mt-3 text-2xl font-black tracking-[-0.05em]">Daily KPI refresh stays live.</p>
              <p className="mt-3 text-sm leading-7 text-white/75">
                Reminder jobs, weekly summaries, and engagement scoring are wired into the platform.
              </p>
              <div className="mt-5 flex items-center justify-between rounded-[1.2rem] bg-white/10 px-4 py-3 text-sm">
                <span>Next refresh</span>
                <span className="font-semibold">6:00 AM</span>
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            <header className="rounded-[2rem] border border-black/5 bg-white p-4 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <label className="flex min-h-11 w-full items-center gap-3 rounded-[1.5rem] border border-slate-200 bg-[#f5f7f2] px-4 py-3 xl:max-w-xl">
                  <AppIcon name="search" className="h-5 w-5 text-slate-500" />
                  <span className="sr-only">Search</span>
                  <input
                    aria-label="Search"
                    className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    placeholder="Search people, approvals, departments, or insights"
                    type="text"
                  />
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                    / F
                  </span>
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/notifications"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-[#f8faf7] text-slate-600 transition-colors hover:border-slate-950 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                    aria-label="Notifications"
                  >
                    <AppIcon name="mail" className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-[#f8faf7] text-slate-600 transition-colors hover:border-slate-950 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                    aria-label="Alerts"
                  >
                    <AppIcon name="bell" className="h-5 w-5" />
                  </Link>
                  <div className="flex min-h-12 items-center gap-3 rounded-[1.5rem] border border-slate-200 bg-[#f8faf7] px-3 py-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f8d9d8] text-sm font-black text-slate-950">
                      {initials || "WI"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{roleName} account</p>
                      <p className="text-sm font-semibold text-slate-950">{displayName}</p>
                      <p className="text-xs text-slate-500">{session?.user?.email ?? "workspace@example.com"}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="ml-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#edf7ee] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#166534]">
                      {roleLabel}
                    </span>
                    <span className="rounded-full bg-[#fff3d6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#915f00]">
                      Designed for clarity
                    </span>
                  </div>
                  <h1 className="mt-5 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">{title}</h1>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-[#f8faf7] px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace status</p>
                    <p className="mt-3 text-lg font-semibold text-slate-950">Live workflows and shared context</p>
                    <p className="mt-2 text-sm text-slate-500">Approvals, reminders, and AI signals all stay in the same workspace.</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-[#f8faf7] px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Today</p>
                    <p className="mt-3 text-lg font-semibold text-slate-950">{todayLabel}</p>
                    <p className="mt-2 text-sm text-slate-500">Built to feel clear, calm, and readable for every SESMag persona.</p>
                  </div>
                </div>
              </div>
            </section>

            <main className="space-y-4">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
