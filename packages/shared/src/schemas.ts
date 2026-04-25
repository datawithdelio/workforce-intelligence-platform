import { z } from "zod";

import {
  changeRequestStatuses,
  engagementRiskLevels,
  userRoles
} from "./constants";

export const userRoleSchema = z.enum(userRoles);

export const changeRequestStatusSchema = z.enum(changeRequestStatuses);

export const engagementRiskLevelSchema = z.enum(engagementRiskLevels);

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const registerRequestSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  jobTitle: z.string().trim().min(1),
  department: z.string().trim().min(1),
  hireDate: z.string().date(),
  phone: z.string().trim().min(7).optional(),
  address: z.string().trim().min(5).optional(),
  bio: z.string().trim().min(10).max(500).optional(),
  avatarUrl: z.string().url().optional()
});

export const adminEmployeeCreateSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["employee", "manager"]).default("employee"),
  jobTitle: z.string().trim().min(1),
  department: z.string().trim().min(1),
  hireDate: z.string().date(),
  phone: z.string().trim().min(7).optional(),
  address: z.string().trim().min(5).optional(),
  bio: z.string().trim().min(10).max(500).optional(),
  avatarUrl: z.string().url().optional(),
  isActive: z.boolean().optional().default(true)
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  department: z.string().trim().optional()
});

export const employeeUpdateSchema = z
  .object({
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
    jobTitle: z.string().trim().min(1).optional(),
    department: z.string().trim().min(1).optional(),
    hireDate: z.string().date().optional(),
    phone: z.string().trim().min(7).optional(),
    address: z.string().trim().min(5).optional(),
    bio: z.string().trim().min(10).max(500).optional(),
    avatarUrl: z.string().url().optional(),
    isActive: z.boolean().optional()
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required."
  });

export const changeRequestReviewSchema = z.object({
  notes: z.string().trim().max(500).optional()
});

export const notificationReadSchema = z.object({
  isRead: z.literal(true).default(true)
});

export const employeeIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const changeRequestIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const scoreEmployeeIdParamSchema = z.object({
  employee_id: z.coerce.number().int().positive()
});

export const dashboardScopeSchema = z.object({
  snapshotDate: z.string().date().optional()
});
