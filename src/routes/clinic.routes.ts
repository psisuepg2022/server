import { Router } from "express";

import { ClinicController } from "@controllers/ClinicController";
import { isSupportMiddleware } from "@middlewares/isSupportMiddleware";

const routes = Router();
const controller = new ClinicController();

routes.get("/:support", isSupportMiddleware, controller.read);
routes.post("/:support", isSupportMiddleware, controller.create);
routes.delete("/:support/:id", isSupportMiddleware, controller.delete);

export { routes };
