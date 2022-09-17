import { Router } from "express";
import { container } from "tsyringe";

import { AuthController } from "@controllers/AuthController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { logMiddleware } from "@middlewares/logMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new AuthController();
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);

routes.get(
  "/",
  logMiddleware,
  ensureAuthenticated.execute,
  controller.getProfile
);
routes.post("/", logMiddleware, controller.login);
routes.post(
  "/reset_password",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  controller.resetPassword
);

export { routes };
