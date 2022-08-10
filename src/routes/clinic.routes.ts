import { Router } from "express";
import { container } from "tsyringe";

import { ClinicController } from "@controllers/ClinicController";
import { isSupportMiddleware } from "@middlewares/isSupportMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new ClinicController();
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);

routes.get("/:support", isSupportMiddleware, controller.read);
routes.post("/:support", isSupportMiddleware, controller.create);
routes.delete(
  "/:support/:id",
  isSupportMiddleware,
  validateClinicID.execute(true, false),
  controller.delete
);

export { routes };
