import { Router } from "express";

import { taskRoutes } from "./task/task.routes.js";
import { githubRoutes } from "./github/github.routes.js";

export const router = Router();

router.use("/api/tasks", taskRoutes);
router.use("/api/github", githubRoutes);
