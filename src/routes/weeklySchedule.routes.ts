import { Router } from "express";

import { WeeklyScheduleController } from "@controllers/WeeklyScheduleController";

const routes = Router();
const controller = new WeeklyScheduleController();

routes.get("/", controller.read);
routes.get("/:professional_id", controller.readByProfessionalId);
routes.delete("/:day/:id", controller.deleteLock);

export { routes };
