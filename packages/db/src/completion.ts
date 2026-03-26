import { requiredProfileFields } from "@workforce/shared";

export interface CompletionProfileShape {
  firstName?: string | null;
  lastName?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  hireDate?: string | Date | null;
  phone?: string | null;
  address?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
}

export function calculateCompletionScore(profile: CompletionProfileShape): number {
  const completed = requiredProfileFields.filter((field) => {
    const value = profile[field];

    if (value === null || value === undefined) {
      return false;
    }

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    return true;
  }).length;

  return Math.round((completed / requiredProfileFields.length) * 100);
}
