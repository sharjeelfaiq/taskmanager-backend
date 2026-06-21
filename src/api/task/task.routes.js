import { Router } from "express";

import { connectDatabase } from "#lib/database.lib.js";
import { validateDto } from "#middlewares/validation.middleware.js";
import { createTaskDto, updateTaskDto } from "./task.dto.js";
import { taskController } from "./task.controller.js";

export const taskRoutes = Router();

taskRoutes.use(async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

taskRoutes
  .get("/", taskController.getAll)
  .post("/", validateDto(createTaskDto), taskController.create)
  .put("/:id", validateDto(updateTaskDto), taskController.update)
  .delete("/:id", taskController.remove);
