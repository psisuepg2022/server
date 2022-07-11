import { Router } from "express";

import { PatientController } from "@controllers/PatientController";

const routes = Router();
const controller = new PatientController();

routes.get("/", controller.read);
routes.post("/", controller.create);

export { routes };
