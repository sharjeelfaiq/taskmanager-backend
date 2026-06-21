import express from "express";
import { router } from "#api/index.js";
import { env } from "#config/env.config.js";
import { logger } from "#lib/logger.lib.js";
import { connectDatabase } from "#lib/database.lib.js";
import { applyGlobalMiddleware } from "#middlewares/global.middleware.js";

const app = express();
const { PORT } = env;

app.listen(PORT, () =>
  logger.info(`Server is running on http://localhost:${PORT}`),
);

app.get("/", (_req, res) => res.json({ status: "OK" }));

applyGlobalMiddleware(app, router);

await connectDatabase();

// (async function startServer() {
// })();

export default app;
