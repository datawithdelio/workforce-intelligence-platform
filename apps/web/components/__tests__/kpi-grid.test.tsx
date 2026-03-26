import React from "react";
import { render, screen } from "@testing-library/react";

import { KpiGrid } from "../kpi-grid";

vi.mock("@workforce/ui", async () => {
  const ReactModule = await import("react");

  return {
    cn: (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" "),
    Card: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      ReactModule.createElement("div", props, children),
    CardTitle: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) =>
      ReactModule.createElement("h3", props, children),
    CardDescription: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) =>
      ReactModule.createElement("p", props, children)
  };
});

describe("KpiGrid", () => {
  it("renders KPI labels and values", () => {
    render(
      <KpiGrid
        kpis={{
          totalEmployees: 10,
          activeEmployees: 8,
          avgCompletionScore: 84,
          pendingApprovals: 3
        }}
      />
    );

    expect(screen.getByText("Total employees")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("84%")).toBeInTheDocument();
    expect(screen.getByText("Waiting for manager review")).toBeInTheDocument();
  });
});
