import { Router } from "express";

import { EmployeeController } from "@controllers/EmployeeController";

const routes = Router();
const controller = new EmployeeController();

routes.get("/:clinic_id", controller.read);
routes.post("/", controller.create);

export { routes };
