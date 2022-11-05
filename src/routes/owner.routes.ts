import { Router } from "express";
import { container } from "tsyringe";

import { RolesKeys } from "@common/RolesKeys";
import { OwnerController } from "@controllers/OwnerController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { isSupportMiddleware } from "@middlewares/isSupportMiddleware";
import { LogMiddleware } from "@middlewares/LogMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new OwnerController();
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);
const RBAC = container.resolve(RBACMiddleware);
const logMiddleware = new LogMiddleware();
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);

routes.get(
  "/:support/:clinic_id",
  logMiddleware.routeStart,
  isSupportMiddleware,
  validateClinicID.execute(false, false, "clinic_id"),
  controller.read
);
routes.post(
  "/:support/:clinic_id",
  logMiddleware.routeStart,
  isSupportMiddleware,
  validateClinicID.execute(true, false, "clinic_id"),
  controller.create
);
routes.get(
  "/profile",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.OWNER),
  controller.getProfile
);
routes.put(
  "/",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.is(RolesKeys.OWNER),
  controller.updateProfile
);

export { routes };
