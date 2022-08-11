import { Router } from "express";

import { RoutesPrefix } from "@common/RoutesPrefix";

import { routes as appointmentsRoutes } from "./appointment.routes";
import { routes as authRoutes } from "./auth.routes";
import { routes as clinicRoutes } from "./clinic.routes";
import { routes as employeeRoutes } from "./employee.routes";
import { routes as ownerRoutes } from "./owner.routes";
import { routes as patientRoutes } from "./patient.routes";
import { routes as professionalRoutes } from "./professional.routes";
import { routes as scheduleRoutes } from "./scheduleLock.routes";
import { routes as weeklyScheduleRoutes } from "./weeklySchedule.routes";

const routes = Router();

routes.use(RoutesPrefix.AUTH, authRoutes);
routes.use(RoutesPrefix.CLINIC, clinicRoutes);
routes.use(RoutesPrefix.EMPLOYEE, employeeRoutes);
routes.use(RoutesPrefix.PATIENT, patientRoutes);
routes.use(RoutesPrefix.PROFESSIONAL, professionalRoutes);
routes.use(RoutesPrefix.OWNER, ownerRoutes);
routes.use(RoutesPrefix.WEEKLY_SCHEDULE, weeklyScheduleRoutes);
routes.use(RoutesPrefix.SCHEDULE_LOCKS, scheduleRoutes);
routes.use(RoutesPrefix.APPOINTMENT, appointmentsRoutes);

export { routes };
