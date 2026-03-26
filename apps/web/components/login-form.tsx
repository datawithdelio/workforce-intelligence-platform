"use client";

import React from "react";
import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";

import { Button, Card, CardDescription, CardTitle, Input, cn } from "@workforce/ui";

interface LoginFormProps {
  title?: string;
  description?: string;
  className?: string;
  hint?: string;
  submitLabel?: string;
}

export function LoginForm({
  title = "Sign in",
  description = "Use your work email and password. Labels stay visible to keep the form easy to scan.",
  className,
  hint = "Demo access is prefilled so you can explore the platform right away.",
  submitLabel = "Sign in"
}: LoginFormProps) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard"
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("We could not sign you in. Please check your email and password.");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <Card className={cn("w-full max-w-xl p-8", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-2">{description}</CardDescription>
        </div>
        <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
          Live demo
        </div>
      </div>
      <p className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">{hint}</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="email">
            Work email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}
        <Button fullWidth type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing you in..." : submitLabel}
        </Button>
      </form>
    </Card>
  );
}
