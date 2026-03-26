"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button, Card, CardDescription, CardTitle, Textarea } from "@workforce/ui";

type ReviewAction = "approve" | "reject";

export function ApprovalReviewForm({
  requestId,
  token,
  status
}: {
  requestId: number | string;
  token?: string;
  status?: string;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isLocked = Boolean(status && status !== "pending");

  function submitReview(action: ReviewAction) {
    if (!token) {
      setMessage("Sign in to send a review decision.");
      return;
    }

    startTransition(async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/change-requests/${requestId}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(notes.trim() ? { notes: notes.trim() } : {})
        }
      );

      if (response.ok) {
        setMessage(action === "approve" ? "Change request approved." : "Change request rejected.");
        router.refresh();
        return;
      }

      setMessage("We could not save that review right now.");
    });
  }

  return (
    <Card className="rounded-[2rem] border border-black/5 p-6 shadow-[0_35px_90px_-65px_rgba(15,23,42,0.55)]">
      <CardTitle className="text-2xl font-black tracking-[-0.05em]">Decision notes</CardTitle>
      <CardDescription className="mt-2 text-base">
        Add context if the employee should know what changed or why the request needs another pass.
      </CardDescription>

      <label className="mt-6 block" htmlFor="reviewNotes">
        <span className="mb-2 block text-sm font-semibold text-slate-900">Reviewer note</span>
        <Textarea
          id="reviewNotes"
          name="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Example: Looks good. This update matches the latest HR record."
          className="min-h-32 rounded-[1.5rem] border-slate-200 bg-[#fafcf9] shadow-none"
          disabled={isPending || isLocked}
        />
      </label>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => submitReview("approve")}
          disabled={isPending || isLocked}
          className="rounded-full bg-[#166534] px-6 hover:bg-[#14532d]"
        >
          {isPending ? "Saving..." : "Approve request"}
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={() => submitReview("reject")}
          disabled={isPending || isLocked}
          className="rounded-full px-6"
        >
          {isPending ? "Saving..." : "Reject request"}
        </Button>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        {message ??
          (isLocked
            ? "This request already has a decision."
            : "Buttons stay large and readable so the next action is obvious on desktop and mobile.")}
      </p>
    </Card>
  );
}
