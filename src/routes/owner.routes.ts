import { Router } from "express";
import { container } from "tsyringe";

import { RolesKeys } from "@common/RolesKeys";
import { OwnerController } from "@controllers/OwnerController";
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
  controller.read
);
routes.post("/:support", logMiddleware, isSupportMiddleware, controller.create);
routes.get(
  "/profile",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.OWNER),
  controller.getProfile
);
routes.put(
  "/",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.OWNER),
  controller.updateProfile
);

export { routes };
