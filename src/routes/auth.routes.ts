import { Router } from "express";
import { container } from "tsyringe";

import { RolesKeys } from "@common/RolesKeys";
import { AuthController } from "@controllers/AuthController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { logMiddleware } from "@middlewares/logMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new AuthController();
const RBAC = container.resolve(RBACMiddleware);
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);

routes.post("/", logMiddleware, controller.login);
routes.post("/refresh", logMiddleware, controller.refreshToken);
routes.post(
  "/reset_password",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  controller.resetPassword
);
routes.post(
  "/adm_reset_password/:user_id",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.OWNER),
  controller.resetAnotherUserPassword
);

export { routes };
