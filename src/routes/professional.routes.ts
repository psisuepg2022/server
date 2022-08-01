import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { ProfessionalController } from "@controllers/ProfessionalController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";

const routes = Router();
const controller = new ProfessionalController();
const RBAC = container.resolve(RBACMiddleware);
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);

routes.get(
  "/:clinic_id",
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.READ_PROFESSIONAL),
  controller.read
);
routes.post(
  "/",
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.CREATE_PROFESSIONAL),
  controller.create
);

export { routes };
