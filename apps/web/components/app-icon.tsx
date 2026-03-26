import type { SVGProps } from "react";

export type IconName =
  | "dashboard"
  | "employees"
  | "approvals"
  | "notifications"
  | "users"
  | "scores"
  | "search"
  | "mail"
  | "bell"
  | "spark"
  | "clock"
  | "shield"
  | "globe"
  | "check"
  | "arrow"
  | "activity"
  | "profile";

export function AppIcon({ name, className }: { name: IconName; className?: string }) {
  const props: SVGProps<SVGSVGElement> = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...props}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="3.5" width="7" height="5" rx="1.5" />
          <rect x="13.5" y="11.5" width="7" height="9" rx="1.5" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "employees":
      return (
        <svg {...props}>
          <path d="M16 20v-1.2a3.8 3.8 0 0 0-3.8-3.8H8.8A3.8 3.8 0 0 0 5 18.8V20" />
          <circle cx="10.5" cy="8.2" r="3.2" />
          <path d="M18.5 8.5a2.5 2.5 0 0 1 0 5" />
          <path d="M18.5 20v-1a3.1 3.1 0 0 0-2.2-3" />
        </svg>
      );
    case "approvals":
      return (
        <svg {...props}>
          <path d="M8 4.5h8l3 3V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V6A1.5 1.5 0 0 1 6.5 4.5H8Z" />
          <path d="M8.5 11.5 10.6 13.6 15.5 8.7" />
        </svg>
      );
    case "notifications":
      return (
        <svg {...props}>
          <path d="M7 17h10" />
          <path d="M9 20a3 3 0 0 0 6 0" />
          <path d="M18 17V11a6 6 0 1 0-12 0v6l-1.5 1.5h15Z" />
        </svg>
      );
    case "users":
      return (
        <svg {...props}>
          <circle cx="8" cy="8" r="3" />
          <circle cx="16.5" cy="9.5" r="2.5" />
          <path d="M3.5 19.5a5.2 5.2 0 0 1 9 0" />
          <path d="M13.8 18.5a4.2 4.2 0 0 1 6.2-.4" />
        </svg>
      );
    case "scores":
      return (
        <svg {...props}>
          <path d="M5 18.5V13" />
          <path d="M10 18.5V8.5" />
          <path d="M15 18.5v-5" />
          <path d="M20 18.5V5.5" />
          <path d="M3.5 20.5h17" />
        </svg>
      );
    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case "mail":
      return (
        <svg {...props}>
          <rect x="4" y="5.5" width="16" height="13" rx="2.5" />
          <path d="m5.5 8 6.5 5 6.5-5" />
        </svg>
      );
    case "bell":
      return (
        <svg {...props}>
          <path d="M6.5 16.5h11" />
          <path d="M9.5 19.5a2.5 2.5 0 0 0 5 0" />
          <path d="M17 16.5V11a5 5 0 1 0-10 0v5l-1.5 1.5h13Z" />
        </svg>
      );
    case "spark":
      return (
        <svg {...props}>
          <path d="m12 3 1.8 4.9L19 9.7l-4.2 3 1.5 5-4.3-2.9-4.3 2.9 1.5-5-4.2-3 5.2-1.8Z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5v5l3 2" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 3.5 19 6v5.5c0 4.2-2.8 7.5-7 9-4.2-1.5-7-4.8-7-9V6l7-2.5Z" />
          <path d="m9.2 12.1 1.8 1.8 3.8-4.3" />
        </svg>
      );
    case "globe":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.8 9h16.4" />
          <path d="M3.8 15h16.4" />
          <path d="M12 3.8c2.4 2.4 3.7 5.3 3.7 8.2 0 2.9-1.3 5.8-3.7 8.2-2.4-2.4-3.7-5.3-3.7-8.2 0-2.9 1.3-5.8 3.7-8.2Z" />
        </svg>
      );
    case "check":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m8.8 12.1 2.1 2.1 4.5-4.8" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...props}>
          <path d="M6 12h12" />
          <path d="m12.5 5.5 6 6.5-6 6.5" />
        </svg>
      );
    case "activity":
      return (
        <svg {...props}>
          <path d="M4 13h3l2-5 3 10 2.5-6H20" />
        </svg>
      );
    case "profile":
      return (
        <svg {...props}>
          <rect x="4.5" y="4" width="15" height="16" rx="2.5" />
          <circle cx="12" cy="9.3" r="2.2" />
          <path d="M8.5 16c.9-1.8 2.1-2.7 3.5-2.7s2.6.9 3.5 2.7" />
        </svg>
      );
  }
}
