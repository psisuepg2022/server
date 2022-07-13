import { Router } from "express";

import { OwnerController } from "@controllers/OwnerController";
import { isSupportMiddleware } from "@middlewares/isSupportMiddleware";

const routes = Router();
const controller = new OwnerController();

routes.get("/:support", isSupportMiddleware, controller.read);
routes.post("/:support", isSupportMiddleware, controller.create);

export { routes };
