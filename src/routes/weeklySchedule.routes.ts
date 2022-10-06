import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { RolesKeys } from "@common/RolesKeys";
import { WeeklyScheduleController } from "@controllers/WeeklyScheduleController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { logMiddleware } from "@middlewares/logMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";

const routes = Router();
const controller = new WeeklyScheduleController();
const RBAC = container.resolve(RBACMiddleware);
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);

routes.get(
  "/",
  logMiddleware,
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.read
);
routes.get(
  "/:professional_id",
  logMiddleware,
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.READ_WEEKLY_SCHEDULE),
  controller.readByProfessionalId
);
routes.delete(
  "/:schedule_id/:lock_id",
  logMiddleware,
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.deleteLock
);
routes.post(
  "/",
  logMiddleware,
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.save
);

export { routes };
