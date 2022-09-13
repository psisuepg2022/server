import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { RolesKeys } from "@common/RolesKeys";
import { ScheduleLockController } from "@controllers/ScheduleLockController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { logMiddleware } from "@middlewares/logMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new ScheduleLockController();
const RBAC = container.resolve(RBACMiddleware);
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);

routes.post(
  "/",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.save
);
routes.post(
  "/:professional_id",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.has(PermissionsKeys.CREATE_SCHEDULE_LOCK),
  controller.saveByProfessional
);
routes.delete(
  "/:id",
  logMiddleware,
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.delete
);
routes.delete(
  "/:professional_id/:id",
  logMiddleware,
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.DELETE_SCHEDULE_LOCK),
  controller.deleteByProfessional
);

export { routes };
