import { Router } from "express";
import { container } from "tsyringe";

import { ClinicController } from "@controllers/ClinicController";
import { isSupportMiddleware } from "@middlewares/isSupportMiddleware";
import { LogMiddleware } from "@middlewares/LogMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new ClinicController();
const logMiddleware = new LogMiddleware();
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);

routes.get(
  "/:support",
  logMiddleware.routeStart,
  isSupportMiddleware,
  controller.read
);
routes.post(
  "/:support",
  logMiddleware.routeStart,
  isSupportMiddleware,
  controller.create
);
routes.delete(
  "/:support/:id",
  logMiddleware.routeStart,
  isSupportMiddleware,
  validateClinicID.execute(true, false),
  controller.delete
);

export { routes };
