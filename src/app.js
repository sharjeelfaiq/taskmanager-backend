import express from "express";
import { router } from "#api/index.js";
import { env } from "#config/env.config.js";
import { logger } from "#lib/logger.lib.js";
import { connectDatabase } from "#lib/database.lib.js";
import { applyGlobalMiddleware } from "#middlewares/global.middleware.js";

const app = express();

app.use(async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

applyGlobalMiddleware(app, router);

if (!process.env.VERCEL) {
  const { PORT } = env;
  app.listen(PORT, () =>
    logger.info(`Server is running on http://localhost:${PORT}`),
  );
}

export default app;
