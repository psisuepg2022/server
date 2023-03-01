import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { RolesKeys } from "@common/RolesKeys";
import { EmployeeController } from "@controllers/EmployeeController";
import {
  EnsureUserAuthenticatedMiddleware,
  HandleUrlPatternMatchMiddleware,
  LogMiddleware,
  RBACMiddleware,
  ValidateClinicIDMiddleware,
} from "@middlewares/index";

const routes = Router();
const controller = new EmployeeController();
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);
const RBAC = container.resolve(RBACMiddleware);
const logMiddleware = new LogMiddleware();
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const handleUrlPatternMatch = new HandleUrlPatternMatchMiddleware();

routes.post(
  "/search",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.READ_EMPLOYEE),
  controller.read,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.post(
  "/",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.has(PermissionsKeys.CREATE_EMPLOYEE),
  controller.create,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.delete(
  "/:id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.OWNER),
  controller.delete,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.get(
  "/profile",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.EMPLOYEE),
  controller.getProfile,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.put(
  "/",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.EMPLOYEE),
  controller.updateProfile,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);

export { routes };
