import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { RolesKeys } from "@common/RolesKeys";
import { WeeklyScheduleController } from "@controllers/WeeklyScheduleController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { HandleUrlPatternMatchMiddleware } from "@middlewares/HandleUrlPatternMatchMiddleware";
import { LogMiddleware } from "@middlewares/LogMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";

const routes = Router();
const controller = new WeeklyScheduleController();
const RBAC = container.resolve(RBACMiddleware);
const logMiddleware = new LogMiddleware();
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const handleUrlPatternMatch = new HandleUrlPatternMatchMiddleware();

routes.get(
  "/",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.read,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.get(
  "/:professional_id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.READ_WEEKLY_SCHEDULE),
  controller.readByProfessionalId,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.delete(
  "/:schedule_id/:lock_id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.deleteLock,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.post(
  "/",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.save,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);

export { routes };
