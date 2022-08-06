import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { RolesKeys } from "@common/RolesKeys";
import { EmployeeController } from "@controllers/EmployeeController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";

const routes = Router();
const controller = new EmployeeController();
const RBAC = container.resolve(RBACMiddleware);
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);

routes.post(
  "/search",
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
routes.delete(
  "/:id",
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.OWNER),
  controller.delete
);

export { routes };
