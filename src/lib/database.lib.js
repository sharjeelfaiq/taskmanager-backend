import mongoose from "mongoose";

import { env } from "#config/env.config.js";
import { logger } from "#lib/logger.lib.js";

export const connectDatabase = async () => {
  await mongoose.connect(env.MONGODB_URI);
  logger.info("Connected to MongoDB");
  mongoose.connection.on("error", (err) =>
    logger.error(`MongoDB error: ${err.message}`),
  );
};
