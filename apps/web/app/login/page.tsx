import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { cn } from "@workforce/ui";

import { LoginForm } from "../../components/login-form";
import { PublicSiteHeader } from "../../components/public-site-header";
import { authOptions } from "../../lib/auth";

const navItems = [
  { label: "Platform", href: "/#platform" },
  { label: "Insights", href: "/#insights" },
  { label: "Stories", href: "/#stories" },
  { label: "Resources", href: "/#resources" }
];

const buttonClassName =
  "inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.token) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#fffdf7]">
      <PublicSiteHeader navItems={navItems} secondaryHref="/" secondaryLabel="Back home" primaryHref="/login" primaryLabel="Portal access" />
      <section className="overflow-hidden bg-[#f7e2a4]">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8 lg:py-16">
          <section className="max-w-3xl">
            <p className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
              Live workforce portal
            </p>
            <h1 className="mt-8 text-[clamp(3.2rem,6vw,6.2rem)] font-black leading-[0.92] tracking-[-0.09em] text-slate-950">
              Sign in to the hub that keeps approvals, people data, and reporting aligned.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
              This demo gives you role-based access to employee profiles, manager review queues, KPI dashboards, audit
              history, notifications, and explainable workforce risk summaries.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className={cn(buttonClassName, "bg-slate-950 text-white hover:bg-slate-800")} href="/">
                View product overview
              </Link>
              <Link className={cn(buttonClassName, "border border-slate-300 bg-white text-slate-950 hover:border-slate-950")} href="/dashboard">
                Go to dashboard
              </Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[2rem] border border-black/10 bg-white/70 px-5 py-5 shadow-[0_24px_60px_-50px_rgba(15,23,42,0.8)]">
                <p className="text-sm font-medium text-slate-600">Profiles tracked</p>
                <p className="mt-3 text-4xl font-black tracking-[-0.08em] text-slate-950">12</p>
              </div>
              <div className="rounded-[2rem] border border-black/10 bg-white/70 px-5 py-5 shadow-[0_24px_60px_-50px_rgba(15,23,42,0.8)]">
                <p className="text-sm font-medium text-slate-600">Waiting for review</p>
                <p className="mt-3 text-4xl font-black tracking-[-0.08em] text-slate-950">3</p>
              </div>
              <div className="rounded-[2rem] border border-black/10 bg-white/70 px-5 py-5 shadow-[0_24px_60px_-50px_rgba(15,23,42,0.8)]">
                <p className="text-sm font-medium text-slate-600">Avg completion</p>
                <p className="mt-3 text-4xl font-black tracking-[-0.08em] text-slate-950">94.5%</p>
              </div>
            </div>
          </section>
          <section className="relative isolate overflow-hidden rounded-[2.75rem] bg-[#c8defd] px-4 py-6 shadow-[0_50px_120px_-60px_rgba(15,23,42,0.8)] sm:px-6 lg:px-8 lg:py-8">
            <div className="pointer-events-none absolute -left-10 top-10 h-56 w-56 rounded-full bg-white/40 blur-3xl" />
            <div className="pointer-events-none absolute right-8 top-10 h-60 w-60 rounded-full bg-[#ffe89d]/70 blur-3xl" />
            <div className="absolute left-5 top-6 hidden rounded-[1.75rem] bg-white px-5 py-4 shadow-[0_35px_90px_-50px_rgba(15,23,42,0.7)] sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Approval queue</p>
              <p className="mt-3 text-3xl font-black tracking-[-0.08em] text-slate-950">3 waiting</p>
              <p className="mt-2 text-sm text-slate-600">Managers can review every change request from one queue.</p>
            </div>
            <div className="absolute bottom-8 left-8 hidden rounded-[1.9rem] bg-slate-950 px-5 py-4 text-white shadow-[0_35px_90px_-50px_rgba(15,23,42,0.85)] lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Daily KPI snapshot</p>
              <p className="mt-3 text-3xl font-black tracking-[-0.08em]">94.5%</p>
              <p className="mt-2 text-sm text-white/70">Average profile completion</p>
            </div>
            <div className="relative z-10 mx-auto mt-20 max-w-xl lg:ml-auto lg:mr-4">
              <LoginForm
                className="w-full max-w-none border border-black/10 bg-white/95 shadow-[0_50px_120px_-60px_rgba(15,23,42,0.85)]"
                title="Enter the live portal"
                description="Use the seeded demo accounts to move through employee, manager, or admin workflows."
                hint="Start with admin@example.com / password123, then try an employee account to compare the experience."
                submitLabel="Open dashboard"
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
