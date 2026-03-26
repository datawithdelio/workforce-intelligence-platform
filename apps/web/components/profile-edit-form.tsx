"use client";

import { useState, useTransition, type FormEvent } from "react";

import { Button, Card, CardDescription, CardTitle, Input, Textarea } from "@workforce/ui";

import { AppIcon } from "./app-icon";

export function ProfileEditForm({
  employee,
  token
}: {
  employee: Record<string, unknown>;
  token?: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setMessage("Demo mode: sign in to send this update for manager review.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(
      Array.from(formData.entries()).filter(([, value]) => String(value).trim().length > 0)
    );

    startTransition(async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/employees/${employee.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (response.ok) {
        setMessage("Your update request was sent for manager review.");
        return;
      }

      setMessage("We could not submit your changes right now.");
    });
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
        <CardTitle className="text-3xl font-black tracking-[-0.05em]">Request a profile update</CardTitle>
        <CardDescription className="mt-2 max-w-2xl text-base">
          Your changes go through a manager review flow first, so everyone sees the same trusted employee record.
        </CardDescription>

        <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="firstName">
              First name
            </label>
            <Input
              defaultValue={String(employee.firstName ?? "")}
              id="firstName"
              name="firstName"
              className="rounded-[1.4rem] border-slate-200 bg-[#fafcf9] shadow-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="lastName">
              Last name
            </label>
            <Input
              defaultValue={String(employee.lastName ?? "")}
              id="lastName"
              name="lastName"
              className="rounded-[1.4rem] border-slate-200 bg-[#fafcf9] shadow-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="jobTitle">
              Job title
            </label>
            <Input
              defaultValue={String(employee.jobTitle ?? "")}
              id="jobTitle"
              name="jobTitle"
              className="rounded-[1.4rem] border-slate-200 bg-[#fafcf9] shadow-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="department">
              Department
            </label>
            <Input
              defaultValue={String(employee.department ?? "")}
              id="department"
              name="department"
              className="rounded-[1.4rem] border-slate-200 bg-[#fafcf9] shadow-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="hireDate">
              Hire date
            </label>
            <Input
              defaultValue={String(employee.hireDate ?? "")}
              id="hireDate"
              name="hireDate"
              type="date"
              className="rounded-[1.4rem] border-slate-200 bg-[#fafcf9] shadow-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="avatarUrl">
              Avatar image URL
            </label>
            <Input
              defaultValue={String(employee.avatarUrl ?? "")}
              id="avatarUrl"
              name="avatarUrl"
              className="rounded-[1.4rem] border-slate-200 bg-[#fafcf9] shadow-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="phone">
              Phone
            </label>
            <Input
              defaultValue={String(employee.phone ?? "")}
              id="phone"
              name="phone"
              className="rounded-[1.4rem] border-slate-200 bg-[#fafcf9] shadow-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="address">
              Address
            </label>
            <Input
              defaultValue={String(employee.address ?? "")}
              id="address"
              name="address"
              className="rounded-[1.4rem] border-slate-200 bg-[#fafcf9] shadow-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="bio">
              Public bio
            </label>
            <Textarea
              defaultValue={String(employee.bio ?? "")}
              id="bio"
              name="bio"
              className="min-h-32 rounded-[1.4rem] border-slate-200 bg-[#fafcf9] shadow-none"
            />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <Button type="submit" disabled={isPending} className="rounded-full bg-[#166534] px-6 hover:bg-[#14532d]">
              {isPending ? "Sending..." : "Send for manager review"}
            </Button>
            <div className="inline-flex min-h-11 items-center rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-500">
              Nothing updates instantly. A manager has to approve it first.
            </div>
          </div>
          {message ? <p className="md:col-span-2 text-sm text-slate-600">{message}</p> : null}
        </form>
      </Card>

      <div className="space-y-4">
        <Card className="rounded-[2rem] border border-black/5 bg-[radial-gradient(circle_at_top,rgba(82,192,112,0.28),transparent_35%),linear-gradient(160deg,#0f2e1f,#134e36_55%,#0d2f20)] p-6 text-white shadow-[0_35px_90px_-50px_rgba(15,23,42,0.8)]">
          <CardTitle className="text-2xl font-black tracking-[-0.05em] text-white">What happens next</CardTitle>
          <CardDescription className="mt-2 text-base text-white/75">
            The platform turns every change into a reviewable request, then logs the decision in the audit trail.
          </CardDescription>

          <div className="mt-6 space-y-3">
            {[
              "You submit the request.",
              "A manager or admin reviews the change.",
              "The decision lands in notifications and history."
            ].map((step) => (
              <div key={step} className="rounded-[1.5rem] bg-white/10 px-4 py-4 text-sm leading-7 text-white/85">
                {step}
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf7ee] text-[#166534]">
              <AppIcon name="shield" className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black tracking-[-0.05em]">Clear privacy rules</CardTitle>
              <CardDescription className="mt-2 text-base">
                Private details like phone and address stay restricted, while public profile fields stay easy to share.
              </CardDescription>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-[1.5rem] bg-[#f7faf6] px-4 py-4">
              <p className="text-sm font-semibold text-slate-900">Public fields</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Name, role, team, bio, and avatar can be seen across the workspace.</p>
            </div>
            <div className="rounded-[1.5rem] bg-[#f7faf6] px-4 py-4">
              <p className="text-sm font-semibold text-slate-900">Private fields</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Phone and address only return for the right viewer role.</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
