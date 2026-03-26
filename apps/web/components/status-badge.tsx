import { Badge } from "@workforce/ui";

export function StatusBadge({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  const tone = normalized.includes("approve") || normalized.includes("active") || normalized.includes("low")
    ? "border-[#b8e3c5] bg-[#edf7ee] text-[#166534]"
    : normalized.includes("reject") || normalized.includes("high")
      ? "border-[#f1c9c9] bg-[#fff1f1] text-[#b42318]"
      : normalized.includes("waiting") || normalized.includes("pending") || normalized.includes("medium")
        ? "border-[#f3dd98] bg-[#fff6d8] text-[#915f00]"
        : normalized.includes("new")
          ? "border-[#cad8f7] bg-[#f1f5ff] text-[#2140a4]"
          : normalized.includes("read")
            ? "border-slate-200 bg-slate-100 text-slate-600"
            : "border-slate-200 bg-slate-100 text-slate-700";
  const dotTone = normalized.includes("approve") || normalized.includes("active") || normalized.includes("low")
    ? "bg-[#16a34a]"
    : normalized.includes("reject") || normalized.includes("high")
      ? "bg-[#ef4444]"
      : normalized.includes("waiting") || normalized.includes("pending") || normalized.includes("medium")
        ? "bg-[#f59e0b]"
        : normalized.includes("new")
          ? "bg-[#3867f2]"
          : "bg-slate-400";

  return (
    <Badge className={tone}>
      <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${dotTone}`} />
      <span>{label}</span>
    </Badge>
  );
}
