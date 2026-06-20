import createError from "http-errors";

import { taskRepository } from "./task.repository.js";

export const taskService = {
  getAllTasks: () => taskRepository.findAll(),

  createTask: (data) => taskRepository.create(data),

  updateTask: async (id, data) => {
    const task = await taskRepository.updateById(id, data);
    if (!task) throw createError(404, "Task not found");
    return task;
  },

  deleteTask: async (id) => {
    const task = await taskRepository.deleteById(id);
    if (!task) throw createError(404, "Task not found");
    return task;
  },
};
