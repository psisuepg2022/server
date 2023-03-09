import { Router } from "express";
import { container } from "tsyringe";

import { RolesKeys } from "@common/RolesKeys";
import { OwnerController } from "@controllers/OwnerController";
import {
  EnsureUserAuthenticatedMiddleware,
  HandleUrlPatternMatchMiddleware,
  isSupportMiddleware,
  LogMiddleware,
  RBACMiddleware,
  ValidateClinicIDMiddleware,
} from "@middlewares/index";

const routes = Router();
const controller = new OwnerController();
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);
const RBAC = container.resolve(RBACMiddleware);
const logMiddleware = new LogMiddleware();
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const handleUrlPatternMatchMiddleware = new HandleUrlPatternMatchMiddleware();

routes.get(
  "/:support/:clinic_id",
  logMiddleware.routeStart,
  isSupportMiddleware,
  validateClinicID.execute(false, false, "clinic_id"),
  controller.read,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.post(
  "/:support/:clinic_id",
  logMiddleware.routeStart,
  isSupportMiddleware,
  validateClinicID.execute(true, false, "clinic_id"),
  controller.create,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.get(
  "/profile",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.OWNER),
  controller.getProfile,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.put(
  "/",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.is(RolesKeys.OWNER),
  controller.updateProfile,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);

export { routes };
