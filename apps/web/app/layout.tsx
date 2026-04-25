import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Providers } from "../components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workforce Intelligence Platform",
  description: "A SESMag-aware HR portal with analytics, approvals, and engagement scoring."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
