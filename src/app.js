import express from "express";
import { router } from "#api/index.js";
import { env } from "#config/env.config.js";
import { logger } from "#lib/logger.lib.js";
import { applyGlobalMiddleware } from "#middlewares/global.middleware.js";

const app = express();

applyGlobalMiddleware(app, router);

if (!process.env.VERCEL) {
  const { PORT } = env;
  app.listen(PORT, () =>
    logger.info(`Server is running on http://localhost:${PORT}`),
  );
}

export default app;
