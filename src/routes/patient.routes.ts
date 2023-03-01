import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { PatientController } from "@controllers/PatientController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { HandleUrlPatternMatchMiddleware } from "@middlewares/HandleUrlPatternMatchMiddleware";
import { LogMiddleware } from "@middlewares/LogMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new PatientController();
const RBAC = container.resolve(RBACMiddleware);
const logMiddleware = new LogMiddleware();
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);
const handleUrlPatternMatch = new HandleUrlPatternMatchMiddleware();

routes.post(
  "/search",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.READ_PATIENT),
  controller.read,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.post(
  "/search_liable",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.READ_LIABLE),
  controller.readLiable,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.post(
  "/",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.has(PermissionsKeys.CREATE_PATIENT),
  controller.save,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);
routes.delete(
  "/:id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.DELETE_PATIENT),
  controller.delete,
  handleUrlPatternMatch.setHasUrlMatchedMiddleware(true)
);

export { routes };
