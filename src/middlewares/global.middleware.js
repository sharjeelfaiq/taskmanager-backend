import morgan from "morgan";
import cors from "cors";
import express from "express";

import { env } from "#config/env.config.js";
import { logger } from "#lib/logger.lib.js";
import { connectDatabase } from "#lib/database.lib.js";

const { NODE_ENV, FRONTEND_URL } = env;

const getAllowedOrigins = () => {
  if (process.env.ALLOWED_ORIGINS) {
    return process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  }
  return [FRONTEND_URL];
};

const corsOptions = {
  origin: (origin, callback) => {
    const allowed = getAllowedOrigins();
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS: Origin not allowed"));
    }
  },
};

// eslint-disable-next-line no-unused-vars
const errorHandler = async (err, _, res, __) => {
  const isDevelopment = NODE_ENV === "development";

  const errorResponse = {
    status: err.statusCode || 500,
    message: err.message || "Something went wrong",
    stack: isDevelopment ? err.stack : "No stack trace available",
  };

  logger.error(JSON.stringify(errorResponse, null, 2));
  res.status(errorResponse.status).json(errorResponse);
};

const invalidPromiseHandler = (req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
};

const applyGlobalMiddleware = async (app, router) => {
  await connectDatabase();

  app.use(morgan("dev"));
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(router);
  app.use(invalidPromiseHandler);
  app.use(errorHandler);
};

export { applyGlobalMiddleware };
