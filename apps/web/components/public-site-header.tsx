import Link from "next/link";

import { cn } from "@workforce/ui";

type NavItem = {
  label: string;
  href: string;
};

interface PublicSiteHeaderProps {
  navItems?: NavItem[];
  secondaryHref?: string;
  secondaryLabel?: string;
  primaryHref: string;
  primaryLabel: string;
}

const actionClassName =
  "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";

export function PublicSiteHeader({
  navItems = [],
  secondaryHref,
  secondaryLabel,
  primaryHref,
  primaryLabel
}: PublicSiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          className="text-[2.75rem] font-black leading-none tracking-[-0.1em] text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
          href="/"
        >
          workforce.
        </Link>
        {navItems.length > 0 ? (
          <nav aria-label="Public site" className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
        <div className="flex flex-wrap items-center justify-end gap-3">
          {secondaryHref && secondaryLabel ? (
            <Link
              className={cn(actionClassName, "border border-slate-300 bg-white text-slate-950 hover:border-slate-950")}
              href={secondaryHref}
            >
              {secondaryLabel}
            </Link>
          ) : null}
          <Link className={cn(actionClassName, "bg-slate-950 text-white hover:bg-slate-800")} href={primaryHref}>
            {primaryLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
