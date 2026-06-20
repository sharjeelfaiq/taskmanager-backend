import { Router } from "express";

import { githubController } from "./github.controller.js";

export const githubRoutes = Router();

githubRoutes.get("/:username", githubController.getProfile);
