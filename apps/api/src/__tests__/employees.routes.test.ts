import request from "supertest";

import type { AppServices } from "../services";
import { createApp } from "../app";
import { bearerTokenFor } from "./helpers";

const services: AppServices = {
  auth: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    me: vi.fn()
  },
  employees: {
    list: vi.fn().mockResolvedValue({ items: [], page: 1, pageSize: 10 }),
    create: vi.fn().mockResolvedValue({ message: "created", employee: { id: 2 } }),
    getById: vi.fn().mockResolvedValue({ id: 1, firstName: "Alex" }),
    update: vi.fn().mockResolvedValue({ message: "submitted" }),
    history: vi.fn().mockResolvedValue([]),
    delete: vi.fn().mockResolvedValue({ message: "deleted", id: 1 })
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

describe("employee routes", () => {
  it("lists employees", async () => {
    const app = await createApp(services);
    const response = await request(app)
      .get("/api/v1/employees")
      .set("Authorization", bearerTokenFor({ id: 2, email: "manager@example.com", role: "manager" }));

    expect(response.status).toBe(200);
    expect(services.employees.list).toHaveBeenCalled();
  });

  it("submits a profile change request", async () => {
    const app = await createApp(services);
    const response = await request(app)
      .put("/api/v1/employees/1")
      .set("Authorization", bearerTokenFor({ id: 3, email: "employee@example.com", role: "employee" }))
      .send({ bio: "Updated bio that is long enough." });

    expect(response.status).toBe(200);
    expect(services.employees.update).toHaveBeenCalled();
  });

  it("lets admins create and delete employees", async () => {
    const app = await createApp(services);
    const adminToken = bearerTokenFor({ id: 1, email: "admin@example.com", role: "admin" });

    const createResponse = await request(app)
      .post("/api/v1/employees")
      .set("Authorization", adminToken)
      .send({
        firstName: "Taylor",
        lastName: "Ops",
        email: "taylor.ops@example.com",
        password: "password123",
        role: "employee",
        jobTitle: "Operations Analyst",
        department: "Operations",
        hireDate: "2026-04-24"
      });

    const deleteResponse = await request(app)
      .delete("/api/v1/employees/1")
      .set("Authorization", adminToken);

    expect(createResponse.status).toBe(201);
    expect(deleteResponse.status).toBe(200);
    expect(services.employees.create).toHaveBeenCalled();
    expect(services.employees.delete).toHaveBeenCalled();
  });
});
