import { Router } from "express";

import { taskRoutes } from "./task/task.routes.js";
import { githubRoutes } from "./github/github.routes.js";
import { connectDatabase } from "#lib/database.lib.js";

export const router = Router();

router.use(async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

router.get("/", (_req, res) =>
  res.status(200).json({ status: "OK", message: "Backend API is running" }),
);

router.use("/api/tasks", taskRoutes);
router.use("/api/github", githubRoutes);
