import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { RolesKeys } from "@common/RolesKeys";
import { AppointmentController } from "@controllers/AppointmentController";
import { databaseDisconnectMiddleware } from "@middlewares/databaseDisconnectMiddleware";
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
  controller.save,
  databaseDisconnectMiddleware
);
routes.post(
  "/calendar",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.getCalendar,
  databaseDisconnectMiddleware
);
routes.post(
  "/calendar/:professional_id",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.READ_APPOINTMENTS),
  controller.getCalendarByProfessional,
  databaseDisconnectMiddleware
);
routes.post(
  "/autocomplete_patient",
  logMiddleware,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.READ_PATIENT),
  controller.autocompletePatient,
  databaseDisconnectMiddleware
);
routes.patch(
  "/status/:id",
  logMiddleware,
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.UPDATE_APPOINTMENTS),
  controller.updateStatus,
  databaseDisconnectMiddleware
);
routes.get(
  "/:appointment_id",
  logMiddleware,
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.getById,
  databaseDisconnectMiddleware
);

export { routes };
