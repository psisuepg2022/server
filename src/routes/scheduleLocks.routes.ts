import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { RolesKeys } from "@common/RolesKeys";
import { ScheduleLocksController } from "@controllers/ScheduleLocksController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";

const routes = Router();
const controller = new ScheduleLocksController();
const RBAC = container.resolve(RBACMiddleware);
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);

routes.post(
  "/search",
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.READ_SCHEDULE_LOCK),
  controller.read
);
routes.post(
  "/",
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.save
);
routes.post(
  "/:professional_id",
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.CREATE_SCHEDULE_LOCK),
  controller.saveByProfessional
);
routes.delete(
  "/:id",
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.delete
);
routes.delete(
  "/:professional_id/:id",
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.DELETE_SCHEDULE_LOCK),
  controller.deleteByProfessional
);

export { routes };
