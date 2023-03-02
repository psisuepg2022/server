import { Router } from "express";
import { container } from "tsyringe";

import { RolesKeys } from "@common/RolesKeys";
import { CommentsController } from "@controllers/CommentsController";
import {
  EnsureUserAuthenticatedMiddleware,
  HandleUrlPatternMatchMiddleware,
  LogMiddleware,
  RBACMiddleware,
  ValidateClinicIDMiddleware,
} from "@middlewares/index";

const routes = Router();
const controller = new CommentsController();
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);
const RBAC = container.resolve(RBACMiddleware);
const logMiddleware = new LogMiddleware();
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const handleUrlPatternMatchMiddleware = new HandleUrlPatternMatchMiddleware();

routes.post(
  "/:id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  logMiddleware.userAuthenticated,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.save,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.post(
  "/search/:patient_id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.read,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);

export { routes };
