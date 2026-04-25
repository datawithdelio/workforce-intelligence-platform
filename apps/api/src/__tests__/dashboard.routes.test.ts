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
    getKpis: vi.fn().mockResolvedValue({}),
    getActivity: vi.fn().mockResolvedValue([])
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

describe("dashboard routes", () => {
  it("returns KPI data", async () => {
    const app = await createApp(services);
    const response = await request(app)
      .get("/api/v1/dashboard/kpis")
      .set("Authorization", bearerTokenFor({ id: 1, email: "admin@example.com", role: "admin" }));

    expect(response.status).toBe(200);
    expect(services.dashboard.getKpis).toHaveBeenCalled();
  });
});
