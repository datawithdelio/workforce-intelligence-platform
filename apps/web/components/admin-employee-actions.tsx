"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Button, Input, Textarea } from "@workforce/ui";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

type EmployeeRow = {
  id: number;
  userId?: number;
  role: string;
  firstName: string;
  lastName: string;
};

export function AdminEmployeeCreateForm({ token }: { token?: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "password123",
    role: "employee",
    jobTitle: "",
    department: "",
    hireDate: new Date().toISOString().slice(0, 10),
    phone: "",
    address: "",
    bio: ""
  });

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setMessage("Sign in as an admin to add employees.");
      return;
    }

    startTransition(async () => {
      const response = await fetch(`${apiBaseUrl}/employees`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          phone: form.phone.trim() || undefined,
          address: form.address.trim() || undefined,
          bio: form.bio.trim() || undefined
        })
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setMessage(payload?.message ?? "We could not create the employee right now.");
        return;
      }

      setMessage("Employee added and saved to the database.");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "password123",
        role: "employee",
        jobTitle: "",
        department: "",
        hireDate: new Date().toISOString().slice(0, 10),
        phone: "",
        address: "",
        bio: ""
      });
      router.refresh();
    });
  }

  return (
    <form className="mt-6 grid gap-4 rounded-[1.75rem] border border-slate-200 bg-[#f7faf6] p-5 lg:grid-cols-2" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="new-first-name">
          First name
        </label>
        <Input id="new-first-name" value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="new-last-name">
          Last name
        </label>
        <Input id="new-last-name" value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="new-email">
          Work email
        </label>
        <Input id="new-email" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="new-password">
          Temporary password
        </label>
        <Input id="new-password" type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="new-job-title">
          Job title
        </label>
        <Input id="new-job-title" value={form.jobTitle} onChange={(event) => updateField("jobTitle", event.target.value)} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="new-department">
          Department
        </label>
        <Input id="new-department" value={form.department} onChange={(event) => updateField("department", event.target.value)} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="new-hire-date">
          Hire date
        </label>
        <Input id="new-hire-date" type="date" value={form.hireDate} onChange={(event) => updateField("hireDate", event.target.value)} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="new-role">
          Role
        </label>
        <select
          id="new-role"
          value={form.role}
          onChange={(event) => updateField("role", event.target.value)}
          className="flex min-h-11 w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="new-phone">
          Phone
        </label>
        <Input id="new-phone" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="new-address">
          Address
        </label>
        <Input id="new-address" value={form.address} onChange={(event) => updateField("address", event.target.value)} />
      </div>
      <div className="lg:col-span-2">
        <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="new-bio">
          Bio
        </label>
        <Textarea
          id="new-bio"
          value={form.bio}
          onChange={(event) => updateField("bio", event.target.value)}
          className="min-h-24 rounded-[1rem] border-slate-200 bg-white shadow-none"
        />
      </div>
      <div className="lg:col-span-2 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isPending} className="rounded-full bg-[#166534] px-6 hover:bg-[#14532d]">
          {isPending ? "Adding..." : "Add employee"}
        </Button>
        <p className="text-sm text-slate-500">This writes a user + profile row to the database and refreshes the directory.</p>
      </div>
      {message ? <p className="lg:col-span-2 text-sm text-slate-600">{message}</p> : null}
    </form>
  );
}

export function EmployeeRowActions({
  employee,
  token,
  canDelete
}: {
  employee: EmployeeRow;
  token?: string;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!token || !canDelete) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${employee.firstName} ${employee.lastName}? This removes the account and profile from the database.`
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const response = await fetch(`${apiBaseUrl}/employees/${employee.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setMessage(payload?.message ?? "We could not delete this employee.");
        return;
      }

      setMessage(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <a
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        href={`/employees/${employee.id}`}
      >
        Open profile
      </a>
      {canDelete ? (
        <Button
          type="button"
          variant="danger"
          disabled={isPending}
          onClick={handleDelete}
          className="rounded-full px-4"
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      ) : null}
      {message ? <p className="w-full text-right text-xs text-red-600">{message}</p> : null}
    </div>
  );
}
