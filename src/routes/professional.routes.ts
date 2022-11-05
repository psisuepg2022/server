import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { RolesKeys } from "@common/RolesKeys";
import { ProfessionalController } from "@controllers/ProfessionalController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { LogMiddleware } from "@middlewares/LogMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new ProfessionalController();
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);
const RBAC = container.resolve(RBACMiddleware);
const logMiddleware = new LogMiddleware();
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);

routes.post(
  "/search",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.READ_PROFESSIONAL),
  controller.read
);
routes.post(
  "/",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.has(PermissionsKeys.CREATE_PROFESSIONAL),
  controller.create
);
routes.delete(
  "/:id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.OWNER),
  controller.delete
);
routes.get(
  "/profile",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.getProfile
);
routes.put(
  "/",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.updateProfile
);
routes.get(
  "/top_bar",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.READ_APPOINTMENTS),
  controller.getProfessionalsToScheduleTopBar
);
routes.post(
  "/configure",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.PROFESSIONAL_UNCONFIGURED),
  controller.configure
);
routes.post(
  "/my_patients",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.myPatients
);

export { routes };
