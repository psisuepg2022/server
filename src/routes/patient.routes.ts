import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { PatientController } from "@controllers/PatientController";
import {
  EnsureUserAuthenticatedMiddleware,
  HandleUrlPatternMatchMiddleware,
  LogMiddleware,
  RBACMiddleware,
  ValidateClinicIDMiddleware,
} from "@middlewares/index";

const routes = Router();
const controller = new PatientController();
const RBAC = container.resolve(RBACMiddleware);
const logMiddleware = new LogMiddleware();
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);
const handleUrlPatternMatchMiddleware = new HandleUrlPatternMatchMiddleware();

routes.post(
  "/search",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.READ_PATIENT),
  controller.read,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.post(
  "/search_liable",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.READ_LIABLE),
  controller.readLiable,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.post(
  "/",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.has(PermissionsKeys.CREATE_PATIENT),
  controller.save,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.delete(
  "/:id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.DELETE_PATIENT),
  controller.delete,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);

export { routes };
