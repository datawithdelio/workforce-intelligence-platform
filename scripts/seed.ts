import bcrypt from "bcryptjs";

import {
  auditLogs,
  calculateCompletionScore,
  db,
  departments,
  employeeProfiles,
  engagementScores,
  kpiSnapshots,
  notifications,
  profileChangeRequests,
  users
} from "@workforce/db";

async function main() {
  await db.delete(notifications);
  await db.delete(auditLogs);
  await db.delete(profileChangeRequests);
  await db.delete(engagementScores);
  await db.delete(kpiSnapshots);
  await db.delete(employeeProfiles);
  await db.delete(departments);
  await db.delete(users);

  const passwordHash = await bcrypt.hash("password123", 10);

  const insertedUsers = await db
    .insert(users)
    .values([
      { email: "admin@example.com", passwordHash, role: "admin" },
      { email: "sam.patel@example.com", passwordHash, role: "manager" },
      { email: "nina.ross@example.com", passwordHash, role: "manager" },
      { email: "maya.lee@example.com", passwordHash, role: "employee" },
      { email: "olivia.james@example.com", passwordHash, role: "employee" },
      { email: "jordan.kim@example.com", passwordHash, role: "employee" },
      { email: "diego.ortiz@example.com", passwordHash, role: "employee" },
      { email: "ava.nguyen@example.com", passwordHash, role: "employee" },
      { email: "sofia.reed@example.com", passwordHash, role: "employee" },
      { email: "liam.turner@example.com", passwordHash, role: "employee" },
      { email: "noah.bennett@example.com", passwordHash, role: "employee" },
      { email: "isabella.moore@example.com", passwordHash, role: "employee" },
      { email: "ethan.clark@example.com", passwordHash, role: "employee" }
    ])
    .returning();

  const userByEmail = Object.fromEntries(insertedUsers.map((user) => [user.email, user]));

  await db.insert(departments).values([
    { name: "Engineering", managerId: userByEmail["sam.patel@example.com"].id },
    { name: "Operations", managerId: userByEmail["nina.ross@example.com"].id },
    { name: "HR", managerId: userByEmail["admin@example.com"].id }
  ]);

  const profileInputs = [
    {
      email: "sam.patel@example.com",
      firstName: "Sam",
      lastName: "Patel",
      jobTitle: "Engineering Manager",
      department: "Engineering",
      hireDate: "2023-03-18",
      phone: "(555) 010-2222",
      address: "45 Birch Road",
      bio: "Leads platform delivery and mentors the engineering team.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
    },
    {
      email: "nina.ross@example.com",
      firstName: "Nina",
      lastName: "Ross",
      jobTitle: "Operations Manager",
      department: "Operations",
      hireDate: "2022-08-09",
      phone: "(555) 010-1112",
      address: "72 Maple Street",
      bio: "Oversees operational readiness and employee support workflows.",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
    },
    {
      email: "maya.lee@example.com",
      firstName: "Maya",
      lastName: "Lee",
      jobTitle: "Data Analyst",
      department: "Operations",
      hireDate: "2024-06-12",
      phone: "(555) 010-1111",
      address: "12 Cedar Ave",
      bio: "Supports analytics and reporting for operations workflows.",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"
    },
    {
      email: "olivia.james@example.com",
      firstName: "Olivia",
      lastName: "James",
      jobTitle: "HR Coordinator",
      department: "HR",
      hireDate: "2025-01-08",
      phone: "(555) 010-3333",
      address: "89 Pine Lane",
      bio: "",
      avatarUrl: ""
    },
    {
      email: "jordan.kim@example.com",
      firstName: "Jordan",
      lastName: "Kim",
      jobTitle: "Frontend Engineer",
      department: "Engineering",
      hireDate: "2024-10-14",
      phone: "(555) 010-4444",
      address: "15 Lake View",
      bio: "Builds design-system driven user experiences.",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
    },
    {
      email: "diego.ortiz@example.com",
      firstName: "Diego",
      lastName: "Ortiz",
      jobTitle: "Backend Engineer",
      department: "Engineering",
      hireDate: "2024-04-22",
      phone: "(555) 010-5555",
      address: "21 River Road",
      bio: "Owns APIs, data contracts, and backend reliability.",
      avatarUrl: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=600&q=80"
    },
    {
      email: "ava.nguyen@example.com",
      firstName: "Ava",
      lastName: "Nguyen",
      jobTitle: "Product Designer",
      department: "Engineering",
      hireDate: "2023-11-03",
      phone: null,
      address: null,
      bio: "Designs employee-first workflows with accessibility in mind.",
      avatarUrl: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=600&q=80"
    },
    {
      email: "sofia.reed@example.com",
      firstName: "Sofia",
      lastName: "Reed",
      jobTitle: "HR Specialist",
      department: "HR",
      hireDate: "2024-09-05",
      phone: "(555) 010-7777",
      address: "44 Grove Street",
      bio: "Supports onboarding and employee records.",
      avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80"
    },
    {
      email: "liam.turner@example.com",
      firstName: "Liam",
      lastName: "Turner",
      jobTitle: "Support Analyst",
      department: "Operations",
      hireDate: "2023-12-11",
      phone: "(555) 010-8888",
      address: "17 Walnut Drive",
      bio: "Responds to team support requests and maintains records.",
      avatarUrl: "https://images.unsplash.com/photo-1507120410856-1f35574c3b45?auto=format&fit=crop&w=600&q=80"
    },
    {
      email: "noah.bennett@example.com",
      firstName: "Noah",
      lastName: "Bennett",
      jobTitle: "Operations Analyst",
      department: "Operations",
      hireDate: "2024-01-19",
      phone: "(555) 010-9999",
      address: "",
      bio: "Builds reporting workflows and process documentation.",
      avatarUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=600&q=80"
    },
    {
      email: "isabella.moore@example.com",
      firstName: "Isabella",
      lastName: "Moore",
      jobTitle: "Talent Partner",
      department: "HR",
      hireDate: "2023-07-14",
      phone: "(555) 010-1212",
      address: "4 Pine Circle",
      bio: "Partners with teams on staffing and candidate experience.",
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80"
    },
    {
      email: "ethan.clark@example.com",
      firstName: "Ethan",
      lastName: "Clark",
      jobTitle: "Platform Engineer",
      department: "Engineering",
      hireDate: "2024-02-27",
      phone: "(555) 010-1313",
      address: "98 Ocean Blvd",
      bio: "",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const insertedProfiles = await db
    .insert(employeeProfiles)
    .values(
      profileInputs.map((profile) => ({
        userId: userByEmail[profile.email].id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        jobTitle: profile.jobTitle,
        department: profile.department,
        hireDate: profile.hireDate,
        phone: profile.phone,
        address: profile.address,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        completionScore: calculateCompletionScore(profile),
        isActive: true
      }))
    )
    .returning();

  const profileByEmail = Object.fromEntries(profileInputs.map((profile, index) => [profile.email, insertedProfiles[index]]));

  await db.insert(profileChangeRequests).values([
    {
      employeeId: profileByEmail["maya.lee@example.com"].id,
      fieldName: "bio",
      oldValue: "Supports reporting.",
      newValue: "Supports analytics and reporting for operations workflows.",
      status: "pending"
    },
    {
      employeeId: profileByEmail["olivia.james@example.com"].id,
      fieldName: "phone",
      oldValue: "(555) 010-3332",
      newValue: "(555) 010-3333",
      status: "pending"
    },
    {
      employeeId: profileByEmail["jordan.kim@example.com"].id,
      fieldName: "jobTitle",
      oldValue: "Frontend Developer",
      newValue: "Frontend Engineer",
      status: "approved",
      reviewedBy: userByEmail["sam.patel@example.com"].id,
      reviewedAt: new Date(),
      notes: "Updated title matches team records."
    },
    {
      employeeId: profileByEmail["noah.bennett@example.com"].id,
      fieldName: "address",
      oldValue: "Old address",
      newValue: "17 Walnut Drive",
      status: "rejected",
      reviewedBy: userByEmail["nina.ross@example.com"].id,
      reviewedAt: new Date(),
      notes: "Need proof of address before applying this update."
    },
    {
      employeeId: profileByEmail["ethan.clark@example.com"].id,
      fieldName: "bio",
      oldValue: "",
      newValue: "Maintains infrastructure and release automation.",
      status: "pending"
    }
  ]);

  await db.insert(auditLogs).values([
    {
      actorId: userByEmail["maya.lee@example.com"].id,
      action: "auth.login",
      entityType: "user",
      entityId: userByEmail["maya.lee@example.com"].id,
      payload: { email: "maya.lee@example.com" }
    },
    {
      actorId: userByEmail["sam.patel@example.com"].id,
      action: "profile.change_request_approved",
      entityType: "employee_profile",
      entityId: profileByEmail["jordan.kim@example.com"].id,
      payload: { fieldName: "jobTitle" }
    },
    {
      actorId: userByEmail["nina.ross@example.com"].id,
      action: "profile.change_request_rejected",
      entityType: "employee_profile",
      entityId: profileByEmail["noah.bennett@example.com"].id,
      payload: { fieldName: "address" }
    }
  ]);

  await db.insert(notifications).values([
    {
      userId: userByEmail["maya.lee@example.com"].id,
      message: "Your bio update is waiting for manager review.",
      type: "change_request_submitted"
    },
    {
      userId: userByEmail["olivia.james@example.com"].id,
      message: "Your profile is 72% complete. Please finish missing details.",
      type: "incomplete_profile_reminder",
      isRead: true
    }
  ]);

  await db.insert(kpiSnapshots).values({
    snapshotDate: "2026-03-26",
    totalEmployees: insertedProfiles.length,
    activeEmployees: insertedProfiles.length,
    avgCompletionScore:
      insertedProfiles.reduce((sum, profile) => sum + profile.completionScore, 0) / insertedProfiles.length,
    pendingApprovals: 3,
    avgApprovalDays: 1.7,
    departmentHeadcount: {
      Engineering: 5,
      Operations: 4,
      HR: 3
    }
  });

  await db.insert(engagementScores).values([
    {
      employeeId: profileByEmail["maya.lee@example.com"].id,
      score: 0.27,
      riskLevel: "low",
      explanation: "Profile is mostly complete and was updated recently."
    },
    {
      employeeId: profileByEmail["olivia.james@example.com"].id,
      score: 0.72,
      riskLevel: "high",
      explanation: "Profile completion is low and the profile has not been updated recently."
    },
    {
      employeeId: profileByEmail["ava.nguyen@example.com"].id,
      score: 0.49,
      riskLevel: "medium",
      explanation: "Some profile fields are still missing and activity is moderate."
    }
  ]);

  console.log("Seed complete.");
}

main().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
