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
    list: vi.fn().mockResolvedValue([]),
    getById: vi.fn().mockResolvedValue({ id: 1 }),
    approve: vi.fn().mockResolvedValue({ message: "approved" }),
    reject: vi.fn().mockResolvedValue({ message: "rejected" })
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

describe("change request routes", () => {
  it("lists pending change requests", async () => {
    const app = await createApp(services);
    const response = await request(app)
      .get("/api/v1/change-requests")
      .set("Authorization", bearerTokenFor({ id: 2, email: "manager@example.com", role: "manager" }));

    expect(response.status).toBe(200);
    expect(services.changeRequests.list).toHaveBeenCalled();
  });

  it("approves a change request", async () => {
    const app = await createApp(services);
    const response = await request(app)
      .post("/api/v1/change-requests/1/approve")
      .set("Authorization", bearerTokenFor({ id: 1, email: "admin@example.com", role: "admin" }))
      .send({ notes: "Looks good." });

    expect(response.status).toBe(200);
    expect(services.changeRequests.approve).toHaveBeenCalled();
  });
});
