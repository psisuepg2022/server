import { Router } from "express";

import { ProfessionalController } from "@controllers/ProfessionalController";

const routes = Router();
const controller = new ProfessionalController();

routes.get("/:clinic_id", controller.read);
routes.post("/", controller.create);

export { routes };
