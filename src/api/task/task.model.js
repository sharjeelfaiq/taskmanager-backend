import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const TaskModel = model("Task", taskSchema);
