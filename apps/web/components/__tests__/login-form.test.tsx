import React from "react";
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";

import { LoginForm } from "../login-form";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  SessionProvider: ({ children }: { children: ReactNode }) => children
}));

vi.mock("@workforce/ui", async () => {
  const ReactModule = await import("react");

  return {
    cn: (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" "),
    Button: ({
      children,
      fullWidth: _fullWidth,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & { fullWidth?: boolean }) =>
      ReactModule.createElement("button", props, children),
    Card: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      ReactModule.createElement("div", props, children),
    CardTitle: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) =>
      ReactModule.createElement("h3", props, children),
    CardDescription: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) =>
      ReactModule.createElement("p", props, children),
    Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => ReactModule.createElement("input", props)
  };
});

describe("LoginForm", () => {
  it("renders visible labels for the main fields", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Work email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });
});
