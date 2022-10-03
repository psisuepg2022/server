import { Router } from "express";
import { container } from "tsyringe";

import { RolesKeys } from "@common/RolesKeys";
import { OwnerController } from "@controllers/OwnerController";
import { databaseDisconnectMiddleware } from "@middlewares/databaseDisconnectMiddleware";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { isSupportMiddleware } from "@middlewares/isSupportMiddleware";
import { logMiddleware } from "@middlewares/logMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new OwnerController();
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);
const RBAC = container.resolve(RBACMiddleware);
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);

routes.get(
  "/:support/:clinic_id",
  logMiddleware,
  isSupportMiddleware,
  validateClinicID.execute(false, false, "clinic_id"),
  controller.read,
  databaseDisconnectMiddleware
);
routes.post(
  "/:support/:clinic_id",
  logMiddleware,
  isSupportMiddleware,
  validateClinicID.execute(true, false, "clinic_id"),
  controller.create,
  databaseDisconnectMiddleware
);
routes.get(
  "/profile",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.OWNER),
  controller.getProfile,
  databaseDisconnectMiddleware
);
routes.put(
  "/",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.is(RolesKeys.OWNER),
  controller.updateProfile,
  databaseDisconnectMiddleware
);

export { routes };
