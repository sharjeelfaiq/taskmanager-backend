import mongoose from "mongoose";

import { logger } from "#lib/logger.lib.js";

export const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI);
  logger.info("Connected to MongoDB");
  mongoose.connection.on("error", (err) =>
    logger.error(`MongoDB error: ${err.message}`),
  );
};
