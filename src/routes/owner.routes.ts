import { Router } from "express";

import { OwnerController } from "@controllers/OwnerController";

const routes = Router();
const controller = new OwnerController();

routes.get("/", controller.read);
routes.post("/", controller.create);
routes.delete("/:id", controller.delete);

export { routes };
