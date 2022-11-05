import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { RolesKeys } from "@common/RolesKeys";
import { EmployeeController } from "@controllers/EmployeeController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { LogMiddleware } from "@middlewares/LogMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new EmployeeController();
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
  RBAC.has(PermissionsKeys.READ_EMPLOYEE),
  controller.read
);
routes.post(
  "/",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.has(PermissionsKeys.CREATE_EMPLOYEE),
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
  RBAC.is(RolesKeys.EMPLOYEE),
  controller.getProfile
);
routes.put(
  "/",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.EMPLOYEE),
  controller.updateProfile
);

export { routes };
