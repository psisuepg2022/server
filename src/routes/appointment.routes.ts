import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { RolesKeys } from "@common/RolesKeys";
import { AppointmentController } from "@controllers/AppointmentController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { LogMiddleware } from "@middlewares/LogMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new AppointmentController();
const RBAC = container.resolve(RBACMiddleware);
const logMiddleware = new LogMiddleware();
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);

routes.post(
  "/",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.has(PermissionsKeys.CREATE_APPOINTMENT),
  controller.save
);
routes.post(
  "/by_the_professional",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.byTheProfessional
);
routes.post(
  "/calendar",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.getCalendar
);
routes.post(
  "/calendar/:professional_id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.READ_APPOINTMENTS),
  controller.getCalendarByProfessional
);
routes.post(
  "/autocomplete_patient",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.READ_PATIENT),
  controller.autocompletePatient
);
routes.post(
  "/autocomplete_patient_by_the_professional",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.autocompletePatientByTheProfessional
);
routes.patch(
  "/status/:id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.UPDATE_APPOINTMENTS),
  controller.updateStatus
);
routes.get(
  "/:appointment_id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.getById
);

export { routes };
