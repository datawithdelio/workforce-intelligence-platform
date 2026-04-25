import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      role: "employee" | "manager" | "admin";
      employeeId?: number | null;
      firstName?: string | null;
      lastName?: string | null;
      token: string;
    };
  }

  interface User {
    id: number;
    email: string;
    role: "employee" | "manager" | "admin";
    employeeId?: number | null;
    firstName?: string | null;
    lastName?: string | null;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number;
    email?: string;
    role?: "employee" | "manager" | "admin";
    employeeId?: number | null;
    firstName?: string | null;
    lastName?: string | null;
    token?: string;
  }
}
