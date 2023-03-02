import { Router } from "express";
import { container } from "tsyringe";

import { ClinicController } from "@controllers/ClinicController";
import {
  HandleUrlPatternMatchMiddleware,
  isSupportMiddleware,
  LogMiddleware,
  ValidateClinicIDMiddleware,
} from "@middlewares/index";

const routes = Router();
const controller = new ClinicController();
const logMiddleware = new LogMiddleware();
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);
const handleUrlPatternMatchMiddleware = new HandleUrlPatternMatchMiddleware();

routes.get(
  "/:support",
  logMiddleware.routeStart,
  isSupportMiddleware,
  controller.read,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.post(
  "/:support",
  logMiddleware.routeStart,
  isSupportMiddleware,
  controller.create,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);
routes.delete(
  "/:support/:id",
  logMiddleware.routeStart,
  isSupportMiddleware,
  validateClinicID.execute(true, false),
  controller.delete,
  handleUrlPatternMatchMiddleware.setHasUrlMatched()
);

export { routes };
