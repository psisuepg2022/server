import { Router } from "express";
import { container } from "tsyringe";

import { RolesKeys } from "@common/RolesKeys";
import { CommentsController } from "@controllers/CommentsController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { logMiddleware } from "@middlewares/logMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new CommentsController();
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);
const RBAC = container.resolve(RBACMiddleware);
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);

routes.post(
  "/:id",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.create
);
routes.get(
  "/:patient_id",
  logMiddleware,
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.read
);
routes.get(
  "/appointment_id",
  logMiddleware,
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.getById
);

export { routes };
