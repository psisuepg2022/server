import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { RolesKeys } from "@common/RolesKeys";
import { AppointmentController } from "@controllers/AppointmentController";
import {
  EnsureUserAuthenticatedMiddleware,
  HandleUrlPatternMatchMiddleware,
  LogMiddleware,
  RBACMiddleware,
  ValidateClinicIDMiddleware,
} from "@middlewares/index";

const routes = Router();
const controller = new AppointmentController();
const RBAC = container.resolve(RBACMiddleware);
const logMiddleware = new LogMiddleware();
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);
const handleUrlPatternMatchMiddleware = new HandleUrlPatternMatchMiddleware();

routes.post(
  "/",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.has(PermissionsKeys.CREATE_APPOINTMENT),
  controller.save,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.post(
  "/by_the_professional",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.byTheProfessional,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.post(
  "/calendar",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.getCalendar,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.post(
  "/calendar/:professional_id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.READ_APPOINTMENTS),
  controller.getCalendarByProfessional,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.post(
  "/autocomplete_patient",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.has(PermissionsKeys.READ_PATIENT),
  controller.autocompletePatient,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.post(
  "/autocomplete_patient_by_the_professional",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  validateClinicID.execute(),
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.autocompletePatientByTheProfessional,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.patch(
  "/status/:id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.UPDATE_APPOINTMENTS),
  controller.updateStatus,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.get(
  "/:appointment_id",
  logMiddleware.routeStart,
  ensureAuthenticated.execute,
  RBAC.is(RolesKeys.PROFESSIONAL),
  controller.getById,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);

export { routes };
