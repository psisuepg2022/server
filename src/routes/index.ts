import { Router } from "express";

import { RoutesPrefix } from "@common/RoutesPrefix";

import { routes as clinicRoutes } from "./clinic.routes";

const routes = Router();

routes.use(RoutesPrefix.CLINIC, clinicRoutes);

export { routes };
