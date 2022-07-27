import { Router } from "express";

import { PatientController } from "@controllers/PatientController";

const routes = Router();
const controller = new PatientController();

routes.get("/:clinic_id", controller.read);
routes.post("/", controller.create);

export { routes };
