import type {
  changeRequestStatuses,
  engagementRiskLevels,
  notificationTypes,
  userRoles
} from "./constants";

export type UserRole = (typeof userRoles)[number];

export type ChangeRequestStatus = (typeof changeRequestStatuses)[number];

export type EngagementRiskLevel = (typeof engagementRiskLevels)[number];

export type NotificationType = (typeof notificationTypes)[keyof typeof notificationTypes];

export type DepartmentHeadcount = Record<string, number>;

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface AuthSessionUser extends AuthUser {
  token: string;
}

export interface EmployeeProfileVisibility {
  canViewPrivateFields: boolean;
  canEdit: boolean;
}
