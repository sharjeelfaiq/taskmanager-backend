import { TaskModel } from "./task.model.js";

export const taskRepository = {
  findAll: () => TaskModel.find().sort({ createdAt: -1 }),

  findById: (id) => TaskModel.findById(id),

  create: (data) => TaskModel.create(data),

  updateById: (id, data) =>
    TaskModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    ),

  deleteById: (id) => TaskModel.findByIdAndDelete(id),
};
