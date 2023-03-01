import { Router } from "express";
import { container } from "tsyringe";

import { RolesKeys } from "@common/RolesKeys";
import { AuthController } from "@controllers/AuthController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { HandleUrlPatternMatchMiddleware } from "@middlewares/HandleUrlPatternMatchMiddleware";
import { LogMiddleware } from "@middlewares/LogMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new AuthController();
const RBAC = container.resolve(RBACMiddleware);
const logMiddleware = new LogMiddleware();
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);
const handleUrlPatternMatch = new HandleUrlPatternMatchMiddleware();

routes.get(
  "/clinics",
  logMiddleware.routeStart,
  controller.getClinics,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.post(
  "/",
  logMiddleware.routeStart,
  controller.login,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.post(
  "/refresh",
  logMiddleware.routeStart,
  controller.refreshToken,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.post(
  "/reset_password",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  controller.resetPassword,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.post(
  "/adm_reset_password/:user_id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.OWNER),
  controller.resetAnotherUserPassword,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);

export { routes };
