import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { EmployeeController } from "@controllers/EmployeeController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";

const routes = Router();
const controller = new EmployeeController();
const RBAC = container.resolve(RBACMiddleware);
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);

routes.get(
  "/",
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.READ_EMPLOYEE),
  controller.read
);
routes.post(
  "/",
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.CREATE_EMPLOYEE),
  controller.create
);

export { routes };
