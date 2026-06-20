import { Router } from "express";

import { validateDto } from "#middlewares/validation.middleware.js";
import { createTaskDto, updateTaskDto } from "./task.dto.js";
import { taskController } from "./task.controller.js";

export const taskRoutes = Router();

taskRoutes
  .get("/", taskController.getAll)
  .post("/", validateDto(createTaskDto), taskController.create)
  .put("/:id", validateDto(updateTaskDto), taskController.update)
  .delete("/:id", taskController.remove);
