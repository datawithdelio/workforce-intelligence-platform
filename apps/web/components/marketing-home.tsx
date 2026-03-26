import Link from "next/link";

import { cn } from "@workforce/ui";

import { LoginForm } from "./login-form";
import { PublicSiteHeader } from "./public-site-header";

const navItems = [
  { label: "Platform", href: "#platform" },
  { label: "Why it works", href: "#why-workforce" },
  { label: "Insights", href: "#insights" },
  { label: "Stories", href: "#stories" },
  { label: "Resources", href: "#resources" }
];

const heroMetrics = [
  { value: "50%", label: "Less time spent stitching reports together" },
  { value: "45 days", label: "Faster movement from onboarding to readiness" },
  { value: "97 hrs", label: "Saved monthly through approvals and automation" }
];

const workflowSteps = [
  {
    title: "Plan headcount with fewer handoffs",
    description: "Bring people data, change requests, and reporting into one operating view so managers stop bouncing between spreadsheets and status threads."
  },
  {
    title: "Review changes without losing context",
    description: "Managers can see what changed, what still needs approval, and what is already complete without digging through multiple tools."
  },
  {
    title: "Understand workforce health at a glance",
    description: "Dashboards, reminders, and explainable scoring stay readable and low-stress for every SESMag persona, especially DAV."
  }
];

const outcomeMetrics = [
  { value: "12 teams", label: "working inside one connected PeopleOps workspace" },
  { value: "94.5%", label: "average profile completeness across the live seed data" },
  { value: "3 pending", label: "manager reviews still waiting for a decision" },
  { value: "Low / medium / high", label: "plain-English engagement signals for admins" }
];

const featureReasons = [
  {
    title: "Connected, all-in-one workforce hub",
    description:
      "Profiles, approvals, dashboard snapshots, reminders, and score summaries live in one calm interface instead of five disconnected tools."
  },
  {
    title: "Built for distributed teams",
    description:
      "The platform is designed for employee, manager, and admin workflows that need to stay clear across departments, devices, and working styles."
  },
  {
    title: "Compliance inside the workflow",
    description:
      "Audit history, approval gates, private-field controls, and visible status text keep the system trustworthy without adding extra process overhead."
  },
  {
    title: "AI-assisted, insight-led operations",
    description:
      "Automations and explainable scoring turn raw workforce activity into readable signals, faster follow-up, and better planning."
  }
];

const stories = [
  {
    category: "Case study",
    title: "Operations teams reduce approval delays without adding more admin work",
    description: "Queue summaries, review history, and notifications help managers keep profile changes moving."
  },
  {
    category: "Analytics",
    title: "People teams finally see completion trends and risk signals in one dashboard",
    description: "KPI snapshots, headcount rollups, and engagement summaries turn raw workforce data into decisions."
  },
  {
    category: "Automation",
    title: "Weekly nudges keep incomplete profiles from turning into cleanup projects",
    description: "Reminder scripts, audit logs, and approval workflows stay visible so nothing quietly slips through."
  }
];

const resources = [
  {
    type: "Guide",
    title: "Designing people systems for clarity, accessibility, and trust",
    cta: "Read the guide"
  },
  {
    type: "Playbook",
    title: "How to build workforce dashboards that product teams actually use",
    cta: "See the playbook"
  },
  {
    type: "Template",
    title: "A better handoff from employee edits to manager approval decisions",
    cta: "Explore the template"
  }
];

const buttonClassName =
  "inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";

function StoryVisual({ accentClassName, floatingLabel }: { accentClassName: string; floatingLabel: string }) {
  return (
    <div className="relative h-64 overflow-hidden rounded-[2rem] bg-[#cfe3ff] p-6">
      <div className={cn("absolute -left-10 bottom-0 h-52 w-72 rounded-[3rem] rotate-[-8deg]", accentClassName)} />
      <div className="absolute left-6 top-6 rounded-3xl bg-white px-4 py-3 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.6)]">
        <p className="text-sm font-semibold text-slate-900">{floatingLabel}</p>
        <div className="mt-3 flex items-end gap-2">
          <div className="h-8 w-5 rounded-full bg-[#94bff7]" />
          <div className="h-12 w-5 rounded-full bg-[#bdd8ff]" />
          <div className="h-16 w-5 rounded-full bg-[#ffe26a]" />
          <div className="h-10 w-5 rounded-full bg-white/70 ring-1 ring-slate-200" />
        </div>
      </div>
      <div className="absolute right-6 top-10 rounded-[1.75rem] bg-white/95 p-5 shadow-[0_35px_90px_-45px_rgba(15,23,42,0.65)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Workforce view</p>
        <p className="mt-3 text-3xl font-black tracking-[-0.06em] text-slate-950">94.5%</p>
        <p className="mt-2 text-sm text-slate-600">Average profile completion</p>
      </div>
      <div className="absolute bottom-6 right-8 rounded-[1.75rem] bg-slate-950 px-5 py-4 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Queue</p>
        <p className="mt-2 text-2xl font-black tracking-[-0.06em]">3 waiting</p>
      </div>
    </div>
  );
}

export function MarketingHome() {
  return (
    <main className="min-h-screen bg-[#fffdf7] text-slate-950">
      <PublicSiteHeader navItems={navItems} secondaryHref="/login" secondaryLabel="Log in" primaryHref="#access" primaryLabel="Open the workspace" />

      <section className="overflow-hidden border-b border-black/5 bg-[#f7e2a4]">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
              Workforce intelligence for modern people teams
            </p>
            <h1 className="mt-8 text-[clamp(3.5rem,7vw,7rem)] font-black leading-[0.92] tracking-[-0.09em] text-slate-950">
              Keep planning, approvals,
              <span className="mt-3 block text-[#8f7ef7]">and reporting in one connected flow.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
              Workforce Intelligence Platform brings employee edits, manager review, KPI visibility, reminders, and
              explainable risk signals into one readable PeopleOps system that stays fast to learn and calm to use.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className={cn(buttonClassName, "bg-slate-950 text-white hover:bg-slate-800")} href="#access">
                Open demo access
              </Link>
              <Link className={cn(buttonClassName, "border border-slate-300 bg-white text-slate-950 hover:border-slate-950")} href="#platform">
                See how it works
              </Link>
            </div>
            <dl className="mt-12 grid gap-4 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <div key={metric.value} className="rounded-[2rem] border border-black/10 bg-white/65 px-5 py-5 shadow-[0_24px_60px_-50px_rgba(15,23,42,0.8)] backdrop-blur">
                  <dt className="text-sm font-medium text-slate-600">{metric.label}</dt>
                  <dd className="mt-3 text-4xl font-black tracking-[-0.08em] text-slate-950">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div id="access" className="relative isolate overflow-hidden rounded-[2.75rem] bg-[#bed9fb] px-4 py-6 shadow-[0_50px_120px_-60px_rgba(15,23,42,0.8)] sm:px-6 lg:px-8 lg:py-8">
            <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-white/35 blur-3xl" />
            <div className="pointer-events-none absolute right-8 top-8 h-64 w-64 rounded-full bg-[#ffe89d]/70 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/25 blur-3xl" />

            <div className="absolute left-4 top-5 hidden rounded-[1.75rem] bg-white/95 px-5 py-4 shadow-[0_35px_90px_-50px_rgba(15,23,42,0.7)] sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Headcount</p>
              <p className="mt-3 text-4xl font-black tracking-[-0.08em] text-slate-950">362</p>
              <p className="mt-2 text-sm text-slate-600">Employees actively tracked</p>
            </div>

            <div className="absolute right-5 top-8 hidden rounded-[1.75rem] bg-white/92 px-5 py-4 shadow-[0_35px_90px_-50px_rgba(15,23,42,0.7)] lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Approval queue</p>
              <p className="mt-3 text-3xl font-black tracking-[-0.08em] text-slate-950">5 requests</p>
              <div className="mt-3 flex gap-2">
                <span className="rounded-full bg-[#e9f7ee] px-3 py-1 text-xs font-semibold text-[#166534]">2 approved</span>
                <span className="rounded-full bg-[#fff1c2] px-3 py-1 text-xs font-semibold text-[#854d0e]">3 waiting</span>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 hidden rounded-[1.9rem] bg-slate-950 px-5 py-4 text-white shadow-[0_35px_90px_-50px_rgba(15,23,42,0.85)] lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Risk summary</p>
              <div className="mt-4 flex gap-3">
                <div>
                  <p className="text-3xl font-black tracking-[-0.08em]">10</p>
                  <p className="text-xs text-white/70">Low</p>
                </div>
                <div>
                  <p className="text-3xl font-black tracking-[-0.08em]">1</p>
                  <p className="text-xs text-white/70">Medium</p>
                </div>
                <div>
                  <p className="text-3xl font-black tracking-[-0.08em]">1</p>
                  <p className="text-xs text-white/70">High</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mx-auto mt-20 max-w-xl lg:ml-auto lg:mr-4">
              <LoginForm
                className="w-full max-w-none border border-black/10 bg-white/95 shadow-[0_50px_120px_-60px_rgba(15,23,42,0.85)]"
                title="Open the workforce hub"
                description="Step into the live portal with the demo account that is already filled in for you."
                hint="Use the prefilled admin demo or replace it with any seeded account to explore role-based views."
                submitLabel="Enter the platform"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="why-workforce" className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.74fr_1.26fr] lg:px-8">
          <div className="flex flex-col justify-start">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Why it works</p>
            <h2 className="mt-5 text-[clamp(2.7rem,5vw,4.7rem)] font-black leading-[0.96] tracking-[-0.08em] text-slate-950">
              Why this workforce platform feels clear, connected, and built to scale.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              The experience is shaped to feel more like a modern product site and less like a school portal:
              stronger language, cleaner typography, and clearer reasons to trust the system.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {featureReasons.map((feature) => (
              <article key={feature.title} className="rounded-[2rem] border border-black/5 bg-[#fffdf7] p-7 shadow-[0_30px_90px_-65px_rgba(15,23,42,0.45)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f7e2a4] text-lg font-black text-slate-950">
                    •
                  </div>
                  <div>
                    <h3 className="text-[clamp(1.85rem,3vw,2.45rem)] font-black leading-[1.02] tracking-[-0.06em] text-slate-950">
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-lg leading-8 text-slate-600">{feature.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-black/5 bg-[#fff4cf]">
        <div className="mx-auto max-w-[1440px] px-4 py-10 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Built for PeopleOps, HR, operations, and analytics teams
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {["Profile workflows", "Manager review", "KPI visibility", "Audit history", "Explainable scoring"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-full border border-black/10 bg-white/70 px-5 py-4 text-sm font-semibold text-slate-700 shadow-[0_25px_60px_-50px_rgba(15,23,42,0.8)]"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section id="platform" className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <StoryVisual accentClassName="bg-[#fff1be]" floatingLabel="Workforce overview" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">How it works</p>
            <h2 className="mt-5 text-[clamp(2.8rem,6vw,5rem)] font-black leading-[0.95] tracking-[-0.08em] text-slate-950">
              From workforce planning to profile maintenance, run it all from one system.
            </h2>
            <div className="mt-10 space-y-8">
              {workflowSteps.map((step, index) => (
                <div key={step.title} className="grid gap-4 sm:grid-cols-[auto_1fr]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fde68a] text-2xl font-black tracking-[-0.06em] text-slate-950">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-[-0.05em] text-slate-950">{step.title}</h3>
                    <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="insights" className="bg-[#fff2bf] py-[4.5rem] sm:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-4xl text-center text-[clamp(2.6rem,5vw,4.75rem)] font-black leading-[0.96] tracking-[-0.08em] text-slate-950">
            What teams save with one connected workforce operations system
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {outcomeMetrics.map((metric) => (
              <div key={metric.value} className="rounded-[2rem] bg-white px-6 py-8 text-center shadow-[0_30px_90px_-55px_rgba(15,23,42,0.85)]">
                <p className="text-5xl font-black tracking-[-0.08em] text-slate-950 sm:text-6xl">{metric.value}</p>
                <p className="mt-4 text-lg leading-8 text-slate-600">{metric.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link className={cn(buttonClassName, "bg-slate-950 text-white hover:bg-slate-800")} href="#access">
              Get demo access
            </Link>
          </div>
        </div>
      </section>

      <section id="stories" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Stories</p>
              <h2 className="mt-4 max-w-4xl text-[clamp(2.5rem,5vw,4.6rem)] font-black leading-[0.98] tracking-[-0.08em] text-slate-950">
                See how teams move faster when approvals, profiles, and reporting stay connected.
              </h2>
            </div>
            <Link className={cn(buttonClassName, "border border-slate-300 bg-white text-slate-950 hover:border-slate-950")} href="/login">
              Explore the live dashboard
            </Link>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {stories.map((story, index) => (
              <article
                key={story.title}
                className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_30px_90px_-60px_rgba(15,23,42,0.85)]"
              >
                <StoryVisual
                  accentClassName={index === 0 ? "bg-[#ffe283]" : index === 1 ? "bg-[#fff1be]" : "bg-[#e7d9ff]"}
                  floatingLabel={story.category}
                />
                <div className="px-8 py-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{story.category}</p>
                  <h3 className="mt-5 text-3xl font-black leading-tight tracking-[-0.05em] text-slate-950">
                    {story.title}
                  </h3>
                  <p className="mt-4 text-lg leading-8 text-slate-600">{story.description}</p>
                  <Link
                    className="mt-8 inline-flex min-h-11 items-center gap-3 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:border-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                    href="/login"
                  >
                    Read more <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="resources" className="bg-[#fffdf7] py-20 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Resources</p>
              <h2 className="mt-4 max-w-4xl text-[clamp(2.5rem,5vw,4.2rem)] font-black leading-[0.98] tracking-[-0.08em] text-slate-950">
                Helpful workforce guides, review playbooks, and analytics templates for growing teams.
              </h2>
            </div>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {resources.map((resource, index) => (
              <article
                key={resource.title}
                className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_30px_90px_-60px_rgba(15,23,42,0.85)]"
              >
                <div
                  className={cn(
                    "relative h-56 overflow-hidden p-6",
                    index === 0 ? "bg-[#cfe3ff]" : index === 1 ? "bg-[#fff0b8]" : "bg-[#d8e9ff]"
                  )}
                >
                  <div className="absolute -right-8 top-8 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
                  <div className="absolute -bottom-10 left-6 h-44 w-64 rounded-[2.5rem] rotate-[-6deg] bg-white/45" />
                  <div className="absolute left-6 top-6 rounded-full border border-black/10 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    {resource.type}
                  </div>
                  <div className="absolute bottom-6 right-6 rounded-[1.5rem] bg-slate-950 px-5 py-4 text-white">
                    <p className="text-2xl font-black tracking-[-0.06em]">{index === 0 ? "KPI" : index === 1 ? "Guide" : "Flow"}</p>
                  </div>
                </div>
                <div className="px-8 py-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{resource.type}</p>
                  <h3 className="mt-5 text-3xl font-black leading-tight tracking-[-0.05em] text-slate-950">
                    {resource.title}
                  </h3>
                  <Link
                    className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:border-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                    href="/login"
                  >
                    {resource.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-10">
            <div>
              <p className="text-[2.75rem] font-black leading-none tracking-[-0.1em]">workforce.</p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                A SESMag-aware workforce portal with approvals, analytics, automations, and explainable engagement
                signals.
              </p>
            </div>
            <Link className={cn(buttonClassName, "bg-white text-slate-950 hover:bg-slate-100")} href="#access">
              Launch the demo
            </Link>
          </div>
          <div className="grid gap-8 py-10 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">Platform</h3>
              <ul className="mt-4 space-y-3 text-base text-white/80">
                <li>Profile workflows</li>
                <li>Manager approvals</li>
                <li>Role-based dashboards</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">Data</h3>
              <ul className="mt-4 space-y-3 text-base text-white/80">
                <li>Daily KPI refresh</li>
                <li>Weekly summaries</li>
                <li>Explainable risk scores</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">For the class</h3>
              <ul className="mt-4 space-y-3 text-base text-white/80">
                <li>DAV-friendly language</li>
                <li>Visible labels and status text</li>
                <li>Mobile-first responsive layout</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">Quick access</h3>
              <ul className="mt-4 space-y-3 text-base text-white/80">
                <li>
                  <Link className="transition-colors hover:text-white" href="/login">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link className="transition-colors hover:text-white" href="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="transition-colors hover:text-white" href="/admin/scores">
                    Risk scores
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
