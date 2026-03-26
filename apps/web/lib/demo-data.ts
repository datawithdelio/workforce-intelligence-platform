export const demoDashboard = {
  snapshotDate: "2026-03-26",
  totalEmployees: 13,
  activeEmployees: 12,
  avgCompletionScore: 84,
  pendingApprovals: 5,
  avgApprovalDays: 1.7,
  departmentHeadcount: {
    Engineering: 6,
    Operations: 4,
    HR: 3
  }
};

export const demoActivity = [
  { id: 1, action: "profile.change_request_submitted", entityType: "employee_profile", entityId: 4, createdAt: "2026-03-26T09:30:00Z" },
  { id: 2, action: "profile.change_request_approved", entityType: "employee_profile", entityId: 2, createdAt: "2026-03-26T08:20:00Z" },
  { id: 3, action: "notification.mark_read", entityType: "notification", entityId: 7, createdAt: "2026-03-25T16:10:00Z" }
];

export const demoEmployees = [
  {
    id: 1,
    userId: 101,
    email: "maya.lee@example.com",
    role: "employee",
    firstName: "Maya",
    lastName: "Lee",
    jobTitle: "Data Analyst",
    department: "Operations",
    hireDate: "2024-06-12",
    phone: "(555) 010-1111",
    address: "12 Cedar Ave",
    bio: "Supports analytics and reporting for operations workflows.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    completionScore: 88,
    isActive: true,
    updatedAt: "2026-03-24T13:00:00Z"
  },
  {
    id: 2,
    userId: 102,
    email: "sam.patel@example.com",
    role: "manager",
    firstName: "Sam",
    lastName: "Patel",
    jobTitle: "Engineering Manager",
    department: "Engineering",
    hireDate: "2023-03-18",
    phone: "(555) 010-2222",
    address: "45 Birch Road",
    bio: "Leads platform delivery and mentors the engineering team.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    completionScore: 96,
    isActive: true,
    updatedAt: "2026-03-22T15:30:00Z"
  },
  {
    id: 3,
    userId: 103,
    email: "olivia.james@example.com",
    role: "employee",
    firstName: "Olivia",
    lastName: "James",
    jobTitle: "HR Coordinator",
    department: "HR",
    hireDate: "2025-01-08",
    phone: "(555) 010-3333",
    address: "89 Pine Lane",
    bio: "Coordinates onboarding and profile updates for employees.",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
    completionScore: 72,
    isActive: true,
    updatedAt: "2026-03-20T10:45:00Z"
  }
];

export const demoChangeRequests = [
  {
    id: 11,
    employeeId: 1,
    fieldName: "bio",
    oldValue: "Supports reporting.",
    newValue: "Supports analytics and reporting for operations workflows.",
    status: "pending",
    requestedAt: "2026-03-26T09:25:00Z",
    notes: null,
    firstName: "Maya",
    lastName: "Lee",
    department: "Operations"
  },
  {
    id: 12,
    employeeId: 3,
    fieldName: "phone",
    oldValue: "(555) 010-3332",
    newValue: "(555) 010-3333",
    status: "pending",
    requestedAt: "2026-03-25T14:10:00Z",
    notes: null,
    firstName: "Olivia",
    lastName: "James",
    department: "HR"
  }
];

export const demoNotifications = [
  {
    id: 1,
    message: "Your bio update is waiting for manager review.",
    type: "change_request_submitted",
    isRead: false,
    createdAt: "2026-03-26T09:25:00Z"
  },
  {
    id: 2,
    message: "Your profile is 72% complete. Please finish missing details.",
    type: "incomplete_profile_reminder",
    isRead: true,
    createdAt: "2026-03-25T09:00:00Z"
  }
];

export const demoUsers = [
  { id: 1, email: "admin@example.com", role: "admin", createdAt: "2026-03-20T10:00:00Z", employeeId: null, department: null },
  { id: 2, email: "sam.patel@example.com", role: "manager", createdAt: "2026-03-20T10:00:00Z", employeeId: 2, department: "Engineering" },
  { id: 3, email: "maya.lee@example.com", role: "employee", createdAt: "2026-03-20T10:00:00Z", employeeId: 1, department: "Operations" }
];

export const demoScoreSummary = {
  total: 10,
  distribution: {
    low: 7,
    medium: 2,
    high: 1
  }
};

export const demoScores = {
  id: 1,
  employeeId: 1,
  score: 0.27,
  riskLevel: "low",
  explanation: "Profile is mostly complete and was updated recently.",
  scoredAt: "2026-03-26T06:00:00Z"
};
