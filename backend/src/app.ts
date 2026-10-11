import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import { authRouter } from "./modules/auth/auth.routes";
import { eventRouter } from "./modules/events/event.routes";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()) }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/api/auth", authRouter);
  app.use("/api/events", eventRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
