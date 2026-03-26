import cors from "cors";
import express from "express";

import { env } from "./env";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import { buildApiRouter } from "./routes";
import { createServices, type AppServices } from "./services";

export async function createApp(services?: AppServices) {
  const resolvedServices = services ?? (await createServices());
  const app = express();

  app.use(
    cors({
      origin: [env.WEB_APP_URL, env.NEXTAUTH_URL],
      credentials: true
    })
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/v1", buildApiRouter(resolvedServices));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
