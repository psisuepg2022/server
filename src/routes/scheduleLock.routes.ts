import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { RolesKeys } from "@common/RolesKeys";
import { ScheduleLockController } from "@controllers/ScheduleLockController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { HandleUrlPatternMatchMiddleware } from "@middlewares/HandleUrlPatternMatchMiddleware";
import { LogMiddleware } from "@middlewares/LogMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new ScheduleLockController();
const RBAC = container.resolve(RBACMiddleware);
const logMiddleware = new LogMiddleware();
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);
const handleUrlPatternMatch = new HandleUrlPatternMatchMiddleware();

routes.post(
  "/",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.save,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.post(
  "/:professional_id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.has(PermissionsKeys.CREATE_SCHEDULE_LOCK),
  controller.saveByProfessional,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.delete(
  "/:id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.delete,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.delete(
  "/:professional_id/:id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.DELETE_SCHEDULE_LOCK),
  controller.deleteByProfessional,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);

export { routes };
