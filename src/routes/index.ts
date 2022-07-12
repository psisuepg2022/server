import { Router } from "express";

import { RoutesPrefix } from "@common/RoutesPrefix";

import { routes as clinicRoutes } from "./clinic.routes";
import { routes as employeeRoutes } from "./employee.routes";
import { routes as ownerRoutes } from "./owner.routes";
import { routes as patientRoutes } from "./patient.routes";
import { routes as professionalRoutes } from "./professional.routes";

const routes = Router();

routes.use(RoutesPrefix.CLINIC, clinicRoutes);
routes.use(RoutesPrefix.EMPLOYEE, employeeRoutes);
routes.use(RoutesPrefix.PATIENT, patientRoutes);
routes.use(RoutesPrefix.PROFESSIONAL, professionalRoutes);
routes.use(RoutesPrefix.OWNER, ownerRoutes);

export { routes };
