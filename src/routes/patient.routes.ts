import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { PatientController } from "@controllers/PatientController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";

const routes = Router();
const controller = new PatientController();
const RBAC = container.resolve(RBACMiddleware);
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);

routes.post(
  "/search",
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.READ_PATIENT),
  controller.read
);
routes.post(
  "/",
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.CREATE_PATIENT),
  controller.create
);
routes.delete(
  "/:id",
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.DELETE_PATIENT),
  controller.delete
);

export { routes };
