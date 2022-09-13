import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { RolesKeys } from "@common/RolesKeys";
import { AppointmentController } from "@controllers/AppointmentController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { logMiddleware } from "@middlewares/logMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new AppointmentController();
const RBAC = container.resolve(RBACMiddleware);
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);

routes.post(
  "/",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.has(PermissionsKeys.CREATE_APPOINTMENT),
  controller.save
);
routes.post(
  "/calendar",
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.getCalendar
);
routes.post(
  "/calendar/:professional_id",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.READ_APPOINTMENTS),
  controller.getCalendarByProfessional
);
routes.post(
  "/autocomplete_patient",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.READ_PATIENT),
  controller.autocompletePatient
);
routes.patch(
  "/status/:id",
  logMiddleware,
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.UPDATE_APPOINTMENTS),
  controller.updateStatus
);

export { routes };
