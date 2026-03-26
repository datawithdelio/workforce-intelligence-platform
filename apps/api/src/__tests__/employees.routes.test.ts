import request from "supertest";

import type { AppServices } from "../services";
import { createApp } from "../app";
import { bearerTokenFor } from "./helpers";

const services: AppServices = {
  auth: {
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn()
  },
  employees: {
    list: vi.fn().mockResolvedValue({ items: [], page: 1, pageSize: 10 }),
    getById: vi.fn().mockResolvedValue({ id: 1, firstName: "Alex" }),
    update: vi.fn().mockResolvedValue({ message: "submitted" }),
    history: vi.fn().mockResolvedValue([])
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
});
