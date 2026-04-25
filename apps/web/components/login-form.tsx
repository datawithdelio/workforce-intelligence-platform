"use client";

import React from "react";
import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";

import { Button, Card, CardDescription, CardTitle, Input, cn } from "@workforce/ui";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

type AuthMode = "signin" | "register";

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
  const [mode, setMode] = useState<AuthMode>("signin");
  const [firstName, setFirstName] = useState("Olivia");
  const [lastName, setLastName] = useState("James");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [jobTitle, setJobTitle] = useState("Operations Analyst");
  const [department, setDepartment] = useState("Operations");
  const [hireDate, setHireDate] = useState("2026-04-23");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (mode === "register") {
      try {
        const response = await fetch(`${apiBaseUrl}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            jobTitle,
            department,
            hireDate
          })
        });

        if (!response.ok) {
          setError("We could not create the account. Try a different email or review the form fields.");
          setIsSubmitting(false);
          return;
        }
      } catch (_error) {
        setError("We could not create the account right now.");
        setIsSubmitting(false);
        return;
      }
    }

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
      <div className="mt-5 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
        {[
          { value: "signin", label: "Sign in" },
          { value: "register", label: "Create account" }
        ].map((item) => {
          const active = mode === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setMode(item.value as AuthMode);
                setError(null);
                setEmail(item.value === "signin" ? "admin@example.com" : "new.employee@example.com");
              }}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                active ? "bg-slate-950 text-white" : "text-slate-600 hover:text-slate-950"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {mode === "signin"
          ? hint
          : "New accounts are created as employee accounts so you can demo the user-to-admin approval flow."}
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="first-name">
                First name
              </label>
              <Input id="first-name" name="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="last-name">
                Last name
              </label>
              <Input id="last-name" name="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} />
            </div>
          </div>
        ) : null}
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
        {mode === "register" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="job-title">
                  Job title
                </label>
                <Input id="job-title" name="jobTitle" value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="department">
                  Department
                </label>
                <Input id="department" name="department" value={department} onChange={(event) => setDepartment(event.target.value)} />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="hire-date">
                Hire date
              </label>
              <Input
                id="hire-date"
                name="hireDate"
                type="date"
                value={hireDate}
                onChange={(event) => setHireDate(event.target.value)}
              />
            </div>
          </>
        ) : null}
        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}
        <Button fullWidth type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "signin"
              ? "Signing you in..."
              : "Creating account..."
            : mode === "signin"
              ? submitLabel
              : "Create account and open dashboard"}
        </Button>
      </form>
    </Card>
  );
}
