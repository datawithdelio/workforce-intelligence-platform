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
    list: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    history: vi.fn()
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
    list: vi.fn().mockResolvedValue([]),
    markRead: vi.fn().mockResolvedValue({ message: "read" })
  },
  scores: {
    getByEmployee: vi.fn().mockResolvedValue({ score: 0.2 }),
    summary: vi.fn().mockResolvedValue({ total: 10, distribution: { low: 8 } })
  },
  admin: {
    listUsers: vi.fn()
  }
};

describe("notification and score routes", () => {
  it("lists notifications", async () => {
    const app = await createApp(services);
    const response = await request(app)
      .get("/api/v1/notifications")
      .set("Authorization", bearerTokenFor({ id: 3, email: "employee@example.com", role: "employee" }));

    expect(response.status).toBe(200);
    expect(services.notifications.list).toHaveBeenCalled();
  });

  it("returns the score summary for admins", async () => {
    const app = await createApp(services);
    const response = await request(app)
      .get("/api/v1/scores/summary")
      .set("Authorization", bearerTokenFor({ id: 1, email: "admin@example.com", role: "admin" }));

    expect(response.status).toBe(200);
    expect(services.scores.summary).toHaveBeenCalled();
  });
});
