import { Router } from "express";
import { container } from "tsyringe";

import { AuthController } from "@controllers/AuthController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new AuthController();
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);

routes.post("/", controller.login);
routes.post(
  "/reset_password",
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  controller.resetPassword
);

export { routes };
