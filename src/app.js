import express from "express";
import { router } from "#api/index.js";
import { env } from "#config/env.config.js";
import { logger } from "#lib/logger.lib.js";
import { connectDatabase } from "#lib/database.lib.js";
import { applyGlobalMiddleware } from "#middlewares/global.middleware.js";

const app = express();

(async function startServer() {
  applyGlobalMiddleware(app, router);
  await connectDatabase();

  app.get("/", (_req, res) => res.json({ status: "OK" }));

  if (!process.env.VERCEL) {
    const { PORT } = env;
    app.listen(PORT, () =>
      logger.info(`Server is running on http://localhost:${PORT}`),
    );
  }
})();

export default app;
