import { Router } from "express";

import { taskRoutes } from "./task/task.routes.js";
import { githubRoutes } from "./github/github.routes.js";

export const router = Router();

router.get("/", (_req, res) =>
  res.status(200).json({ status: "OK", message: "Backend API is running" }),
);
router.get("/api/health", (_req, res) =>
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() }),
);
router.use("/api/tasks", taskRoutes);
router.use("/api/github", githubRoutes);
