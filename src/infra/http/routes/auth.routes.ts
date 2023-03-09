import { Router } from "express";
import { container } from "tsyringe";

import { RolesKeys } from "@common/RolesKeys";
import { AuthController } from "@controllers/AuthController";
import {
  EnsureUserAuthenticatedMiddleware,
  HandleUrlPatternMatchMiddleware,
  LogMiddleware,
  RBACMiddleware,
  ValidateClinicIDMiddleware,
} from "@middlewares/index";

const routes = Router();
const controller = new AuthController();
const RBAC = container.resolve(RBACMiddleware);
const logMiddleware = new LogMiddleware();
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);
const handleUrlPatternMatchMiddleware = new HandleUrlPatternMatchMiddleware();

routes.get(
  "/clinics",
  logMiddleware.routeStart,
  controller.getClinics,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.post(
  "/",
  logMiddleware.routeStart,
  controller.login,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.post(
  "/refresh",
  logMiddleware.routeStart,
  controller.refreshToken,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.post(
  "/reset_password",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  controller.resetPassword,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.post(
  "/adm_reset_password/:user_id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.OWNER),
  controller.resetAnotherUserPassword,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);

export { routes };
