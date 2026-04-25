import bcrypt from "bcryptjs";
import {
  and,
  avg,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lt,
  or
} from "drizzle-orm";

import {
  auditLogs,
  calculateCompletionScore,
  changeRequestStatusEnum,
  db,
  departments,
  employeeProfiles,
  engagementScores,
  kpiSnapshots,
  notifications,
  profileChangeRequests,
  users,
  vApprovalMetrics,
  vCompletionRates,
  vHeadcountByDept
} from "@workforce/db";
import { notificationTypes, type AuthUser, type ChangeRequestStatus } from "@workforce/shared";

import { AppError } from "../lib/errors";
import { signAccessToken } from "../lib/jwt";

export interface AppServices {
  auth: {
    login(input: { email: string; password: string }): Promise<{
      token: string;
      user: AuthUser;
    }>;
    register(input: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      jobTitle: string;
      department: string;
      hireDate: string;
      phone?: string;
      address?: string;
      bio?: string;
      avatarUrl?: string;
    }): Promise<{
      token: string;
      user: AuthUser;
    }>;
    logout(user: AuthUser): Promise<{ message: string }>;
    me(user: AuthUser): Promise<{ user: AuthUser }>;
  };
  employees: {
    list(input: { authUser: AuthUser; page: number; pageSize: number; search?: string; department?: string }): Promise<{
      items: unknown[];
      page: number;
      pageSize: number;
    }>;
    create(input: {
      authUser: AuthUser;
      input: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: "employee" | "manager";
        jobTitle: string;
        department: string;
        hireDate: string;
        phone?: string;
        address?: string;
        bio?: string;
        avatarUrl?: string;
        isActive?: boolean;
      };
    }): Promise<unknown>;
    getById(input: { authUser: AuthUser; employeeId: number }): Promise<unknown>;
    update(input: { authUser: AuthUser; employeeId: number; updates: Record<string, unknown> }): Promise<unknown>;
    history(input: { authUser: AuthUser; employeeId: number }): Promise<unknown[]>;
    delete(input: { authUser: AuthUser; employeeId: number }): Promise<unknown>;
  };
  changeRequests: {
    list(input: { authUser: AuthUser }): Promise<unknown[]>;
    getById(input: { authUser: AuthUser; id: number }): Promise<unknown>;
    approve(input: { authUser: AuthUser; id: number; notes?: string }): Promise<unknown>;
    reject(input: { authUser: AuthUser; id: number; notes?: string }): Promise<unknown>;
  };
  dashboard: {
    getKpis(input: { authUser: AuthUser }): Promise<unknown>;
    getActivity(input: { authUser: AuthUser }): Promise<unknown[]>;
  };
  notifications: {
    list(input: { authUser: AuthUser }): Promise<unknown[]>;
    markRead(input: { authUser: AuthUser; id: number }): Promise<unknown>;
  };
  scores: {
    getByEmployee(input: { authUser: AuthUser; employeeId: number }): Promise<unknown>;
    summary(input: { authUser: AuthUser }): Promise<unknown>;
  };
  admin: {
    listUsers(input: { authUser: AuthUser }): Promise<unknown[]>;
  };
}

function serializeValue(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function mapProfileForViewer(
  row: {
    employeeId: number;
    userId: number;
    email: string;
    role: "employee" | "manager" | "admin";
    firstName: string;
    lastName: string;
    jobTitle: string;
    department: string;
    hireDate: string;
    phone: string | null;
    address: string | null;
    bio: string | null;
    avatarUrl: string | null;
    completionScore: number;
    isActive: boolean;
    updatedAt: Date;
  },
  authUser: AuthUser
) {
  const canViewPrivateFields = authUser.role === "admin" || authUser.id === row.userId;

  return {
    id: row.employeeId,
    userId: row.userId,
    email: row.email,
    role: row.role,
    firstName: row.firstName,
    lastName: row.lastName,
    jobTitle: row.jobTitle,
    department: row.department,
    hireDate: row.hireDate,
    bio: row.bio,
    avatarUrl: row.avatarUrl,
    completionScore: row.completionScore,
    isActive: row.isActive,
    updatedAt: row.updatedAt,
    phone: canViewPrivateFields ? row.phone : null,
    address: canViewPrivateFields ? row.address : null
  };
}

async function resolveManagedDepartments(userId: number): Promise<string[]> {
  const rows = await db.select({ name: departments.name }).from(departments).where(eq(departments.managerId, userId));
  return rows.map((row) => row.name);
}

async function createAuditLog(input: {
  actorId?: number | null;
  action: string;
  entityType: string;
  entityId: number;
  payload?: Record<string, unknown>;
}): Promise<void> {
  await db.insert(auditLogs).values({
    actorId: input.actorId ?? null,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    payload: input.payload ?? {}
  });
}

async function createNotificationRows(userIds: number[], message: string, type: string): Promise<void> {
  if (userIds.length === 0) {
    return;
  }

  await db.insert(notifications).values(
    userIds.map((userId) => ({
      userId,
      message,
      type
    }))
  );
}

async function getProfileWithUser(employeeId: number) {
  const rows = await db
    .select({
      employeeId: employeeProfiles.id,
      userId: users.id,
      email: users.email,
      role: users.role,
      firstName: employeeProfiles.firstName,
      lastName: employeeProfiles.lastName,
      jobTitle: employeeProfiles.jobTitle,
      department: employeeProfiles.department,
      hireDate: employeeProfiles.hireDate,
      phone: employeeProfiles.phone,
      address: employeeProfiles.address,
      bio: employeeProfiles.bio,
      avatarUrl: employeeProfiles.avatarUrl,
      completionScore: employeeProfiles.completionScore,
      isActive: employeeProfiles.isActive,
      updatedAt: employeeProfiles.updatedAt
    })
    .from(employeeProfiles)
    .innerJoin(users, eq(employeeProfiles.userId, users.id))
    .where(eq(employeeProfiles.id, employeeId))
    .limit(1);

  return rows[0] ?? null;
}

async function getAdminUserIds(): Promise<number[]> {
  const rows = await db.select({ id: users.id }).from(users).where(eq(users.role, "admin"));
  return rows.map((row) => row.id);
}

function ensureManagerOrAdmin(authUser: AuthUser): void {
  if (!["manager", "admin"].includes(authUser.role)) {
    throw new AppError("Manager or admin access is required.", 403);
  }
}

async function assertManagerCanAccessDepartment(authUser: AuthUser, departmentName: string): Promise<void> {
  if (authUser.role === "admin") {
    return;
  }

  const managedDepartments = await resolveManagedDepartments(authUser.id);

  if (!managedDepartments.includes(departmentName)) {
    throw new AppError("You can only access employees in your department.", 403);
  }
}

function buildProfileUpdatePayload(fieldName: string, newValue: string | null) {
  switch (fieldName) {
    case "firstName":
      return { firstName: newValue ?? "" };
    case "lastName":
      return { lastName: newValue ?? "" };
    case "jobTitle":
      return { jobTitle: newValue ?? "" };
    case "department":
      return { department: newValue ?? "" };
    case "hireDate":
      return { hireDate: newValue ?? "" };
    case "phone":
      return { phone: newValue };
    case "address":
      return { address: newValue };
    case "bio":
      return { bio: newValue };
    case "avatarUrl":
      return { avatarUrl: newValue };
    case "isActive":
      return { isActive: newValue === "true" };
    default:
      throw new AppError(`Field ${fieldName} is not supported for profile updates.`, 400);
  }
}

async function buildDefaultServices(): Promise<AppServices> {
  return {
    auth: {
      async login(input) {
        const rows = await db
          .select({
            id: users.id,
            email: users.email,
            role: users.role,
            passwordHash: users.passwordHash,
            employeeId: employeeProfiles.id,
            firstName: employeeProfiles.firstName,
            lastName: employeeProfiles.lastName
          })
          .from(users)
          .leftJoin(employeeProfiles, eq(employeeProfiles.userId, users.id))
          .where(eq(users.email, input.email))
          .limit(1);

        const user = rows[0];

        if (!user) {
          throw new AppError("Invalid email or password.", 401);
        }

        const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

        if (!passwordMatches) {
          throw new AppError("Invalid email or password.", 401);
        }

        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          role: user.role,
          employeeId: user.employeeId,
          firstName: user.firstName ?? null,
          lastName: user.lastName ?? null
        };

        await createAuditLog({
          actorId: user.id,
          action: "auth.login",
          entityType: "user",
          entityId: user.id,
          payload: { email: user.email }
        });

        return {
          token: signAccessToken(authUser),
          user: authUser
        };
      },
      async register(input) {
        const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.email, input.email)).limit(1);

        if (existingUser[0]) {
          throw new AppError("An account with that email already exists.", 409);
        }

        const passwordHash = await bcrypt.hash(input.password, 10);
        const completionScore = calculateCompletionScore({
          firstName: input.firstName,
          lastName: input.lastName,
          jobTitle: input.jobTitle,
          department: input.department,
          hireDate: input.hireDate,
          phone: input.phone,
          address: input.address,
          bio: input.bio,
          avatarUrl: input.avatarUrl
        });

        const authUser = await db.transaction(async (tx) => {
          const insertedUsers = await tx
            .insert(users)
            .values({
              email: input.email,
              passwordHash,
              role: "employee"
            })
            .returning({
              id: users.id,
              email: users.email,
              role: users.role
            });

          const createdUser = insertedUsers[0];

          if (!createdUser) {
            throw new AppError("Account creation failed.", 500);
          }

          const existingDepartment = await tx
            .select({ id: departments.id })
            .from(departments)
            .where(eq(departments.name, input.department))
            .limit(1);

          if (!existingDepartment[0]) {
            await tx.insert(departments).values({ name: input.department });
          }

          const createdProfiles = await tx.insert(employeeProfiles).values({
            userId: createdUser.id,
            firstName: input.firstName,
            lastName: input.lastName,
            jobTitle: input.jobTitle,
            department: input.department,
            hireDate: input.hireDate,
            phone: input.phone ?? null,
            address: input.address ?? null,
            bio: input.bio ?? null,
            avatarUrl: input.avatarUrl ?? null,
            completionScore
          }).returning({ id: employeeProfiles.id });

          await tx.insert(auditLogs).values({
            actorId: createdUser.id,
            action: "auth.register",
            entityType: "user",
            entityId: createdUser.id,
            payload: {
              email: createdUser.email,
              role: createdUser.role,
              department: input.department
            }
          });

          return {
            id: createdUser.id,
            email: createdUser.email,
            role: createdUser.role,
            employeeId: createdProfiles[0]?.id ?? null,
            firstName: input.firstName,
            lastName: input.lastName
          } satisfies AuthUser;
        });

        return {
          token: signAccessToken(authUser),
          user: authUser
        };
      },
      async logout(user) {
        await createAuditLog({
          actorId: user.id,
          action: "auth.logout",
          entityType: "user",
          entityId: user.id
        });

        return { message: "Logged out successfully." };
      },
      async me(user) {
        return { user };
      }
    },
    employees: {
      async list({ authUser, page, pageSize, search, department }) {
        ensureManagerOrAdmin(authUser);
        const filters: any[] = [];

        if (department) {
          filters.push(eq(employeeProfiles.department, department));
        }

        if (search) {
          filters.push(
            or(
              ilike(employeeProfiles.firstName, `%${search}%`),
              ilike(employeeProfiles.lastName, `%${search}%`),
              ilike(users.email, `%${search}%`)
            )
          );
        }

        if (authUser.role === "manager") {
          const managedDepartments = await resolveManagedDepartments(authUser.id);
          if (managedDepartments.length === 0) {
            return {
              items: [],
              page,
              pageSize
            };
          }
          filters.push(inArray(employeeProfiles.department, managedDepartments));
        }

        const query = db
          .select({
            employeeId: employeeProfiles.id,
            userId: users.id,
            email: users.email,
            role: users.role,
            firstName: employeeProfiles.firstName,
            lastName: employeeProfiles.lastName,
            jobTitle: employeeProfiles.jobTitle,
            department: employeeProfiles.department,
            hireDate: employeeProfiles.hireDate,
            phone: employeeProfiles.phone,
            address: employeeProfiles.address,
            bio: employeeProfiles.bio,
            avatarUrl: employeeProfiles.avatarUrl,
            completionScore: employeeProfiles.completionScore,
            isActive: employeeProfiles.isActive,
            updatedAt: employeeProfiles.updatedAt
          })
          .from(employeeProfiles)
          .innerJoin(users, eq(employeeProfiles.userId, users.id))
          .limit(pageSize)
          .offset((page - 1) * pageSize)
          .orderBy(employeeProfiles.lastName, employeeProfiles.firstName);

        const rows = filters.length > 0 ? await query.where(and(...filters)) : await query;

        return {
          items: rows.map((row) => mapProfileForViewer(row, authUser)),
          page,
          pageSize
        };
      },
      async getById({ authUser, employeeId }) {
        const row = await getProfileWithUser(employeeId);

        if (!row) {
          throw new AppError("Employee profile not found.", 404);
        }

        if (authUser.role === "manager") {
          await assertManagerCanAccessDepartment(authUser, row.department);
        }

        if (authUser.role === "employee" && authUser.id !== row.userId) {
          throw new AppError("You can only view your own profile.", 403);
        }

        return mapProfileForViewer(row, authUser);
      },
      async create({ authUser, input }) {
        if (authUser.role !== "admin") {
          throw new AppError("Admin access is required.", 403);
        }

        const existingUser = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (existingUser[0]) {
          throw new AppError("An employee with that email already exists.", 409);
        }

        const passwordHash = await bcrypt.hash(input.password, 10);
        const completionScore = calculateCompletionScore({
          firstName: input.firstName,
          lastName: input.lastName,
          jobTitle: input.jobTitle,
          department: input.department,
          hireDate: input.hireDate,
          phone: input.phone,
          address: input.address,
          bio: input.bio,
          avatarUrl: input.avatarUrl
        });

        const createdEmployee = await db.transaction(async (tx) => {
          const departmentRow = await tx
            .select({ id: departments.id })
            .from(departments)
            .where(eq(departments.name, input.department))
            .limit(1);

          if (!departmentRow[0]) {
            await tx.insert(departments).values({ name: input.department });
          }

          const createdUsers = await tx
            .insert(users)
            .values({
              email: input.email,
              passwordHash,
              role: input.role
            })
            .returning({
              id: users.id,
              email: users.email,
              role: users.role
            });

          const createdUser = createdUsers[0];

          if (!createdUser) {
            throw new AppError("Employee account creation failed.", 500);
          }

          const createdProfiles = await tx
            .insert(employeeProfiles)
            .values({
              userId: createdUser.id,
              firstName: input.firstName,
              lastName: input.lastName,
              jobTitle: input.jobTitle,
              department: input.department,
              hireDate: input.hireDate,
              phone: input.phone ?? null,
              address: input.address ?? null,
              bio: input.bio ?? null,
              avatarUrl: input.avatarUrl ?? null,
              completionScore,
              isActive: input.isActive ?? true
            })
            .returning({
              employeeId: employeeProfiles.id,
              updatedAt: employeeProfiles.updatedAt
            });

          const createdProfile = createdProfiles[0];

          if (!createdProfile) {
            throw new AppError("Employee profile creation failed.", 500);
          }

          await tx.insert(auditLogs).values({
            actorId: authUser.id,
            action: "employee.created",
            entityType: "employee_profile",
            entityId: createdProfile.employeeId,
            payload: {
              email: createdUser.email,
              role: createdUser.role,
              department: input.department
            }
          });

          return {
            employeeId: createdProfile.employeeId,
            userId: createdUser.id,
            email: createdUser.email,
            role: createdUser.role,
            firstName: input.firstName,
            lastName: input.lastName,
            jobTitle: input.jobTitle,
            department: input.department,
            hireDate: input.hireDate,
            phone: input.phone ?? null,
            address: input.address ?? null,
            bio: input.bio ?? null,
            avatarUrl: input.avatarUrl ?? null,
            completionScore,
            isActive: input.isActive ?? true,
            updatedAt: createdProfile.updatedAt
          };
        });

        return {
          message: "Employee created successfully.",
          employee: mapProfileForViewer(createdEmployee, authUser)
        };
      },
      async update({ authUser, employeeId, updates }) {
        const row = await getProfileWithUser(employeeId);

        if (!row) {
          throw new AppError("Employee profile not found.", 404);
        }

        if (authUser.id !== row.userId) {
          throw new AppError("Employees can only submit change requests for their own profile.", 403);
        }

        const entries = Object.entries(updates);
        const requestsToCreate = entries
          .map(([fieldName, newValue]) => ({
            employeeId,
            fieldName,
            oldValue: serializeValue((row as Record<string, unknown>)[fieldName]),
            newValue: serializeValue(newValue)
          }))
          .filter((entry) => entry.oldValue !== entry.newValue);

        if (requestsToCreate.length === 0) {
          throw new AppError("No profile changes were detected.", 400);
        }

        const createdRequests = await db.insert(profileChangeRequests).values(requestsToCreate).returning();

        const departmentManagers = await db
          .select({ managerId: departments.managerId })
          .from(departments)
          .where(eq(departments.name, row.department))
          .limit(1);

        const adminUserIds = await getAdminUserIds();
        const recipientIds = [
          ...adminUserIds,
          ...(departmentManagers[0]?.managerId ? [departmentManagers[0].managerId] : [])
        ];

        await createNotificationRows(
          [...new Set(recipientIds)],
          `New change request submitted for ${row.firstName} ${row.lastName}.`,
          notificationTypes.changeRequestSubmitted
        );

        await createAuditLog({
          actorId: authUser.id,
          action: "profile.change_request_submitted",
          entityType: "employee_profile",
          entityId: employeeId,
          payload: { fields: requestsToCreate.map((request) => request.fieldName) }
        });

        return {
          message: "Your update was submitted for manager review.",
          requests: createdRequests
        };
      },
      async history({ authUser, employeeId }) {
        const row = await getProfileWithUser(employeeId);

        if (!row) {
          throw new AppError("Employee profile not found.", 404);
        }

        if (authUser.role === "manager") {
          await assertManagerCanAccessDepartment(authUser, row.department);
        }

        if (authUser.role === "employee" && authUser.id !== row.userId) {
          throw new AppError("You can only view your own profile history.", 403);
        }

        return db
          .select({
            id: auditLogs.id,
            action: auditLogs.action,
            entityType: auditLogs.entityType,
            entityId: auditLogs.entityId,
            payload: auditLogs.payload,
            createdAt: auditLogs.createdAt
          })
          .from(auditLogs)
          .where(and(eq(auditLogs.entityType, "employee_profile"), eq(auditLogs.entityId, employeeId)))
          .orderBy(desc(auditLogs.createdAt));
      },
      async delete({ authUser, employeeId }) {
        if (authUser.role !== "admin") {
          throw new AppError("Admin access is required.", 403);
        }

        const profile = await getProfileWithUser(employeeId);

        if (!profile) {
          throw new AppError("Employee profile not found.", 404);
        }

        if (profile.userId === authUser.id) {
          throw new AppError("You cannot delete your own account.", 400);
        }

        await createAuditLog({
          actorId: authUser.id,
          action: "employee.deleted",
          entityType: "employee_profile",
          entityId: employeeId,
          payload: {
            userId: profile.userId,
            email: profile.email,
            role: profile.role
          }
        });

        await db.delete(users).where(eq(users.id, profile.userId));

        return {
          message: "Employee deleted successfully.",
          id: employeeId
        };
      }
    },
    changeRequests: {
      async list({ authUser }) {
        ensureManagerOrAdmin(authUser);
        const filters: any[] = [eq(profileChangeRequests.status, "pending")];

        if (authUser.role === "manager") {
          const managedDepartments = await resolveManagedDepartments(authUser.id);
          if (managedDepartments.length === 0) {
            return [];
          }
          filters.push(inArray(employeeProfiles.department, managedDepartments));
        }

        return db
          .select({
            id: profileChangeRequests.id,
            employeeId: profileChangeRequests.employeeId,
            fieldName: profileChangeRequests.fieldName,
            oldValue: profileChangeRequests.oldValue,
            newValue: profileChangeRequests.newValue,
            status: profileChangeRequests.status,
            requestedAt: profileChangeRequests.requestedAt,
            firstName: employeeProfiles.firstName,
            lastName: employeeProfiles.lastName,
            department: employeeProfiles.department
          })
          .from(profileChangeRequests)
          .innerJoin(employeeProfiles, eq(profileChangeRequests.employeeId, employeeProfiles.id))
          .where(and(...filters))
          .orderBy(desc(profileChangeRequests.requestedAt));
      },
      async getById({ authUser, id }) {
        ensureManagerOrAdmin(authUser);

        const rows = await db
          .select({
            id: profileChangeRequests.id,
            employeeId: profileChangeRequests.employeeId,
            fieldName: profileChangeRequests.fieldName,
            oldValue: profileChangeRequests.oldValue,
            newValue: profileChangeRequests.newValue,
            status: profileChangeRequests.status,
            requestedAt: profileChangeRequests.requestedAt,
            reviewedAt: profileChangeRequests.reviewedAt,
            notes: profileChangeRequests.notes,
            firstName: employeeProfiles.firstName,
            lastName: employeeProfiles.lastName,
            department: employeeProfiles.department
          })
          .from(profileChangeRequests)
          .innerJoin(employeeProfiles, eq(profileChangeRequests.employeeId, employeeProfiles.id))
          .where(eq(profileChangeRequests.id, id))
          .limit(1);

        const request = rows[0];

        if (!request) {
          throw new AppError("Change request not found.", 404);
        }

        if (authUser.role === "manager") {
          await assertManagerCanAccessDepartment(authUser, request.department);
        }

        return request;
      },
      async approve({ authUser, id, notes }) {
        ensureManagerOrAdmin(authUser);
        const request = (await this.getById({ authUser, id })) as {
          id: number;
          employeeId: number;
          fieldName: string;
          newValue: string | null;
          firstName: string;
          lastName: string;
          department: string;
          status: ChangeRequestStatus;
        };

        if (request.status !== "pending") {
          throw new AppError("Only waiting change requests can be approved.", 400);
        }

        const profile = await getProfileWithUser(request.employeeId);

        if (!profile) {
          throw new AppError("Employee profile not found.", 404);
        }

        const requestedUpdate = buildProfileUpdatePayload(request.fieldName, request.newValue);
        const recomputedCompletionScore = calculateCompletionScore({
          firstName: requestedUpdate.firstName ?? profile.firstName,
          lastName: requestedUpdate.lastName ?? profile.lastName,
          jobTitle: requestedUpdate.jobTitle ?? profile.jobTitle,
          department: requestedUpdate.department ?? profile.department,
          hireDate: requestedUpdate.hireDate ?? profile.hireDate,
          phone: requestedUpdate.phone ?? profile.phone,
          address: requestedUpdate.address ?? profile.address,
          bio: requestedUpdate.bio ?? profile.bio,
          avatarUrl: requestedUpdate.avatarUrl ?? profile.avatarUrl
        });

        await db
          .update(employeeProfiles)
          .set({
            ...requestedUpdate,
            completionScore: recomputedCompletionScore,
            updatedAt: new Date()
          })
          .where(eq(employeeProfiles.id, request.employeeId));

        await db
          .update(profileChangeRequests)
          .set({
            status: "approved",
            reviewedBy: authUser.id,
            reviewedAt: new Date(),
            notes: notes ?? null
          })
          .where(eq(profileChangeRequests.id, id));

        await createNotificationRows(
          [profile.userId],
          `Your profile update for ${request.fieldName} was approved.`,
          notificationTypes.changeRequestApproved
        );

        await createAuditLog({
          actorId: authUser.id,
          action: "profile.change_request_approved",
          entityType: "employee_profile",
          entityId: request.employeeId,
          payload: { changeRequestId: id, fieldName: request.fieldName }
        });

        return {
          message: "Change request approved.",
          id
        };
      },
      async reject({ authUser, id, notes }) {
        ensureManagerOrAdmin(authUser);
        const request = (await this.getById({ authUser, id })) as {
          id: number;
          employeeId: number;
          fieldName: string;
          status: ChangeRequestStatus;
        };

        if (request.status !== "pending") {
          throw new AppError("Only waiting change requests can be rejected.", 400);
        }

        const profile = await getProfileWithUser(request.employeeId);

        if (!profile) {
          throw new AppError("Employee profile not found.", 404);
        }

        await db
          .update(profileChangeRequests)
          .set({
            status: "rejected",
            reviewedBy: authUser.id,
            reviewedAt: new Date(),
            notes: notes ?? null
          })
          .where(eq(profileChangeRequests.id, id));

        await createNotificationRows(
          [profile.userId],
          `Your profile update for ${request.fieldName} was not approved.`,
          notificationTypes.changeRequestRejected
        );

        await createAuditLog({
          actorId: authUser.id,
          action: "profile.change_request_rejected",
          entityType: "employee_profile",
          entityId: request.employeeId,
          payload: { changeRequestId: id, fieldName: request.fieldName }
        });

        return {
          message: "Change request rejected.",
          id
        };
      }
    },
    dashboard: {
      async getKpis({ authUser }) {
        ensureManagerOrAdmin(authUser);

        if (authUser.role === "admin") {
          const snapshot = await db
            .select({
              snapshotDate: kpiSnapshots.snapshotDate,
              avgApprovalDays: kpiSnapshots.avgApprovalDays
            })
            .from(kpiSnapshots)
            .orderBy(desc(kpiSnapshots.snapshotDate), desc(kpiSnapshots.createdAt))
            .limit(1);
          const totalEmployeesRows = await db.select({ total: count() }).from(employeeProfiles);
          const activeEmployeesRows = await db
            .select({ total: count() })
            .from(employeeProfiles)
            .where(eq(employeeProfiles.isActive, true));
          const pendingRows = await db
            .select({ total: count() })
            .from(profileChangeRequests)
            .where(eq(profileChangeRequests.status, "pending"));
          const completionRows = await db
            .select({ avgCompletionScore: avg(employeeProfiles.completionScore) })
            .from(employeeProfiles);
          const headcountRows = await db.select().from(vHeadcountByDept);

          return {
            snapshotDate: snapshot[0]?.snapshotDate ?? new Date().toISOString().slice(0, 10),
            totalEmployees: totalEmployeesRows[0]?.total ?? 0,
            activeEmployees: activeEmployeesRows[0]?.total ?? 0,
            avgCompletionScore: Number(completionRows[0]?.avgCompletionScore ?? 0),
            pendingApprovals: pendingRows[0]?.total ?? 0,
            avgApprovalDays: snapshot[0]?.avgApprovalDays ?? 0,
            departmentHeadcount: Object.fromEntries(headcountRows.map((row) => [row.department, row.headcount]))
          };
        }

        const departmentsForManager = await resolveManagedDepartments(authUser.id);
        if (departmentsForManager.length === 0) {
          return {
            departments: [],
            totalEmployees: 0,
            activeEmployees: 0,
            pendingApprovals: 0,
            completionRates: [],
            approvalMetrics: [],
            headcountByDepartment: []
          };
        }
        const completionRows = await db
          .select()
          .from(vCompletionRates)
          .where(inArray(vCompletionRates.department, departmentsForManager));
        const approvalRows = await db
          .select()
          .from(vApprovalMetrics)
          .where(inArray(vApprovalMetrics.department, departmentsForManager));
        const headcountRows = await db
          .select()
          .from(vHeadcountByDept)
          .where(inArray(vHeadcountByDept.department, departmentsForManager));

        const pendingRows = await db
          .select({ total: count() })
          .from(profileChangeRequests)
          .innerJoin(employeeProfiles, eq(profileChangeRequests.employeeId, employeeProfiles.id))
          .where(
            and(
              eq(profileChangeRequests.status, "pending"),
              inArray(employeeProfiles.department, departmentsForManager)
            )
          );

        const totalEmployeesRows = await db
          .select({ total: count() })
          .from(employeeProfiles)
          .where(inArray(employeeProfiles.department, departmentsForManager));

        const activeEmployeesRows = await db
          .select({ total: count() })
          .from(employeeProfiles)
          .where(and(eq(employeeProfiles.isActive, true), inArray(employeeProfiles.department, departmentsForManager)));

        return {
          departments: departmentsForManager,
          totalEmployees: totalEmployeesRows[0]?.total ?? 0,
          activeEmployees: activeEmployeesRows[0]?.total ?? 0,
          pendingApprovals: pendingRows[0]?.total ?? 0,
          completionRates: completionRows,
          approvalMetrics: approvalRows,
          headcountByDepartment: headcountRows
        };
      },
      async getActivity({ authUser }) {
        ensureManagerOrAdmin(authUser);

        if (authUser.role === "admin") {
          return db
            .select({
              id: auditLogs.id,
              action: auditLogs.action,
              entityType: auditLogs.entityType,
              entityId: auditLogs.entityId,
              createdAt: auditLogs.createdAt
            })
            .from(auditLogs)
            .orderBy(desc(auditLogs.createdAt))
            .limit(20);
        }

        const managedDepartments = await resolveManagedDepartments(authUser.id);
        if (managedDepartments.length === 0) {
          return [];
        }
        return db
          .select({
            id: auditLogs.id,
            action: auditLogs.action,
            entityType: auditLogs.entityType,
            entityId: auditLogs.entityId,
            createdAt: auditLogs.createdAt
          })
          .from(auditLogs)
          .innerJoin(employeeProfiles, eq(auditLogs.entityId, employeeProfiles.id))
          .where(
            and(
              eq(auditLogs.entityType, "employee_profile"),
              inArray(employeeProfiles.department, managedDepartments)
            )
          )
          .orderBy(desc(auditLogs.createdAt))
          .limit(20);
      }
    },
    notifications: {
      async list({ authUser }) {
        return db
          .select()
          .from(notifications)
          .where(eq(notifications.userId, authUser.id))
          .orderBy(desc(notifications.createdAt));
      },
      async markRead({ authUser, id }) {
        const rows = await db
          .select()
          .from(notifications)
          .where(and(eq(notifications.id, id), eq(notifications.userId, authUser.id)))
          .limit(1);

        const notification = rows[0];

        if (!notification) {
          throw new AppError("Notification not found.", 404);
        }

        await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
        await createAuditLog({
          actorId: authUser.id,
          action: "notification.mark_read",
          entityType: "notification",
          entityId: id
        });

        return {
          message: "Notification marked as read.",
          id
        };
      }
    },
    scores: {
      async getByEmployee({ authUser, employeeId }) {
        ensureManagerOrAdmin(authUser);
        const profile = await getProfileWithUser(employeeId);

        if (!profile) {
          throw new AppError("Employee profile not found.", 404);
        }

        if (authUser.role === "manager") {
          await assertManagerCanAccessDepartment(authUser, profile.department);
        }

        const rows = await db
          .select()
          .from(engagementScores)
          .where(eq(engagementScores.employeeId, employeeId))
          .orderBy(desc(engagementScores.scoredAt))
          .limit(1);

        return rows[0] ?? null;
      },
      async summary({ authUser }) {
        if (authUser.role !== "admin") {
          throw new AppError("Admin access is required.", 403);
        }

        const rows = await db.select().from(engagementScores).orderBy(desc(engagementScores.scoredAt));
        const distribution = rows.reduce<Record<string, number>>((accumulator, row) => {
          accumulator[row.riskLevel] = (accumulator[row.riskLevel] ?? 0) + 1;
          return accumulator;
        }, {});

        return {
          total: rows.length,
          distribution
        };
      }
    },
    admin: {
      async listUsers({ authUser }) {
        if (authUser.role !== "admin") {
          throw new AppError("Admin access is required.", 403);
        }

        return db
          .select({
            id: users.id,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
            employeeId: employeeProfiles.id,
            department: employeeProfiles.department
          })
          .from(users)
          .leftJoin(employeeProfiles, eq(employeeProfiles.userId, users.id))
          .orderBy(users.role, users.email);
      }
    }
  };
}

let cachedServices: AppServices | null = null;

export async function createServices(): Promise<AppServices> {
  if (cachedServices) {
    return cachedServices;
  }

  cachedServices = await buildDefaultServices();
  return cachedServices;
}
