import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  pgView,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["employee", "manager", "admin"]);
export const changeRequestStatusEnum = pgEnum("change_request_status", [
  "pending",
  "approved",
  "rejected"
]);
export const engagementRiskLevelEnum = pgEnum("engagement_risk_level", ["low", "medium", "high"]);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("employee"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email)
  })
);

export const employeeProfiles = pgTable(
  "employee_profiles",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    jobTitle: varchar("job_title", { length: 150 }).notNull(),
    department: varchar("department", { length: 100 }).notNull(),
    hireDate: date("hire_date").notNull(),
    phone: varchar("phone", { length: 50 }),
    address: text("address"),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    completionScore: real("completion_score").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    userIdIdx: uniqueIndex("employee_profiles_user_id_idx").on(table.userId)
  })
);

export const profileChangeRequests = pgTable("profile_change_requests", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employeeProfiles.id, { onDelete: "cascade" }),
  fieldName: varchar("field_name", { length: 100 }).notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  status: changeRequestStatusEnum("status").notNull().default("pending"),
  requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  notes: text("notes")
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  actorId: integer("actor_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: integer("entity_id").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const departments = pgTable(
  "departments",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    managerId: integer("manager_id").references(() => users.id, { onDelete: "set null" })
  },
  (table) => ({
    nameIdx: uniqueIndex("departments_name_idx").on(table.name)
  })
);

export const kpiSnapshots = pgTable("kpi_snapshots", {
  id: serial("id").primaryKey(),
  snapshotDate: date("snapshot_date").notNull(),
  totalEmployees: integer("total_employees").notNull(),
  activeEmployees: integer("active_employees").notNull(),
  avgCompletionScore: real("avg_completion_score").notNull(),
  pendingApprovals: integer("pending_approvals").notNull(),
  avgApprovalDays: real("avg_approval_days").notNull(),
  departmentHeadcount: jsonb("department_headcount")
    .$type<Record<string, number>>()
    .notNull()
    .default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const engagementScores = pgTable("engagement_scores", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employeeProfiles.id, { onDelete: "cascade" }),
  score: real("score").notNull(),
  riskLevel: engagementRiskLevelEnum("risk_level").notNull(),
  explanation: text("explanation").notNull(),
  scoredAt: timestamp("scored_at", { withTimezone: true }).notNull().defaultNow()
});

export const vEmployeeSummary = pgView("v_employee_summary", {
  userId: integer("user_id"),
  employeeId: integer("employee_id"),
  email: varchar("email", { length: 255 }),
  role: userRoleEnum("role"),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  jobTitle: varchar("job_title", { length: 150 }),
  department: varchar("department", { length: 100 }),
  completionScore: real("completion_score"),
  isActive: boolean("is_active"),
  managerId: integer("manager_id")
}).existing();

export const vCompletionRates = pgView("v_completion_rates", {
  department: varchar("department", { length: 100 }),
  avgCompletionScore: real("avg_completion_score")
}).existing();

export const vApprovalMetrics = pgView("v_approval_metrics", {
  department: varchar("department", { length: 100 }),
  avgApprovalDays: real("avg_approval_days")
}).existing();

export const vHeadcountByDept = pgView("v_headcount_by_dept", {
  department: varchar("department", { length: 100 }),
  headcount: integer("headcount")
}).existing();

export const vRecentActivity = pgView("v_recent_activity", {
  auditId: integer("audit_id"),
  actorId: integer("actor_id"),
  actorName: varchar("actor_name", { length: 255 }),
  action: varchar("action", { length: 100 }),
  entityType: varchar("entity_type", { length: 100 }),
  entityId: integer("entity_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
}).existing();

export const usersRelations = relations(users, ({ one, many }) => ({
  employeeProfile: one(employeeProfiles, {
    fields: [users.id],
    references: [employeeProfiles.userId]
  }),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
  managedDepartments: many(departments)
}));

export const employeeProfilesRelations = relations(employeeProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [employeeProfiles.userId],
    references: [users.id]
  }),
  changeRequests: many(profileChangeRequests),
  engagementScores: many(engagementScores)
}));

export const profileChangeRequestsRelations = relations(profileChangeRequests, ({ one }) => ({
  employee: one(employeeProfiles, {
    fields: [profileChangeRequests.employeeId],
    references: [employeeProfiles.id]
  }),
  reviewer: one(users, {
    fields: [profileChangeRequests.reviewedBy],
    references: [users.id]
  })
}));

export const departmentsRelations = relations(departments, ({ one }) => ({
  manager: one(users, {
    fields: [departments.managerId],
    references: [users.id]
  })
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id]
  })
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, {
    fields: [auditLogs.actorId],
    references: [users.id]
  })
}));

export const engagementScoresRelations = relations(engagementScores, ({ one }) => ({
  employee: one(employeeProfiles, {
    fields: [engagementScores.employeeId],
    references: [employeeProfiles.id]
  })
}));
