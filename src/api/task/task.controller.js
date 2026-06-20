import mongoose from "mongoose";

import { taskService } from "./task.service.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const taskController = {
  getAll: async (req, res, next) => {
    try {
      const tasks = await taskService.getAllTasks();
      res.json({ success: true, data: tasks });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const task = await taskService.createTask(req.body);
      res.status(201).json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      if (!isValidId(req.params.id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid task ID" });
      }
      const task = await taskService.updateTask(req.params.id, req.body);
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      if (!isValidId(req.params.id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid task ID" });
      }
      await taskService.deleteTask(req.params.id);
      res.json({ success: true, message: "Task deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
};
