export const userRoles = ["employee", "manager", "admin"] as const;

export const changeRequestStatuses = ["pending", "approved", "rejected"] as const;

export const engagementRiskLevels = ["low", "medium", "high"] as const;

export const requiredProfileFields = [
  "firstName",
  "lastName",
  "jobTitle",
  "department",
  "hireDate",
  "phone",
  "address",
  "bio",
  "avatarUrl"
] as const;

export const publicProfileFields = [
  "firstName",
  "lastName",
  "jobTitle",
  "department",
  "hireDate",
  "bio",
  "avatarUrl",
  "completionScore",
  "isActive",
  "updatedAt"
] as const;

export const privateProfileFields = ["phone", "address"] as const;

export const notificationTypes = {
  changeRequestSubmitted: "change_request_submitted",
  changeRequestApproved: "change_request_approved",
  changeRequestRejected: "change_request_rejected",
  incompleteProfileReminder: "incomplete_profile_reminder"
} as const;

export const dashboardSnapshotFallbackDays = 7;
