import { Router } from "express";

import { ClinicController } from "@controllers/ClinicController";

const routes = Router();
const controller = new ClinicController();

routes.get("/", controller.read);
routes.post("/", controller.create);
routes.delete("/:id", controller.delete);

export { routes };
