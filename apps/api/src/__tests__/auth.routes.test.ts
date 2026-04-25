import request from "supertest";

import type { AppServices } from "../services";
import { createApp } from "../app";
import { bearerTokenFor } from "./helpers";

const services: AppServices = {
  auth: {
    login: vi.fn().mockResolvedValue({
      token: "token",
      user: { id: 1, email: "admin@example.com", role: "admin" }
    }),
    register: vi.fn().mockResolvedValue({
      token: "token",
      user: { id: 3, email: "new.employee@example.com", role: "employee" }
    }),
    logout: vi.fn().mockResolvedValue({ message: "Logged out successfully." }),
    me: vi.fn().mockResolvedValue({ user: { id: 1, email: "admin@example.com", role: "admin" } })
  },
  employees: {
    list: vi.fn(),
    create: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    history: vi.fn(),
    delete: vi.fn()
  },
  changeRequests: {
    list: vi.fn(),
    getById: vi.fn(),
    approve: vi.fn(),
    reject: vi.fn()
  },
  dashboard: {
    getKpis: vi.fn(),
    getActivity: vi.fn()
  },
  notifications: {
    list: vi.fn(),
    markRead: vi.fn()
  },
  scores: {
    getByEmployee: vi.fn(),
    summary: vi.fn()
  },
  admin: {
    listUsers: vi.fn()
  }
};

describe("auth routes", () => {
  it("logs a user in", async () => {
    const app = await createApp(services);
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "admin@example.com",
      password: "password123"
    });

    expect(response.status).toBe(200);
    expect(services.auth.login).toHaveBeenCalled();
  });

  it("registers a new employee account", async () => {
    const app = await createApp(services);
    const response = await request(app).post("/api/v1/auth/register").send({
      firstName: "New",
      lastName: "Employee",
      email: "new.employee@example.com",
      password: "password123",
      jobTitle: "Operations Analyst",
      department: "Operations",
      hireDate: "2026-04-23"
    });

    expect(response.status).toBe(201);
    expect(services.auth.register).toHaveBeenCalled();
  });

  it("returns the current user", async () => {
    const app = await createApp(services);
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", bearerTokenFor({ id: 1, email: "admin@example.com", role: "admin" }));

    expect(response.status).toBe(200);
    expect(services.auth.me).toHaveBeenCalled();
  });
});
