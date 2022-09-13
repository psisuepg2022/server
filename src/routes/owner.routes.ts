import { Router } from "express";
import { container } from "tsyringe";

import { OwnerController } from "@controllers/OwnerController";
import { isSupportMiddleware } from "@middlewares/isSupportMiddleware";
import { logMiddleware } from "@middlewares/logMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new OwnerController();
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);

routes.get(
  "/:support/:clinic_id",
  logMiddleware,
  isSupportMiddleware,
  validateClinicID.execute(false, false, "clinic_id"),
  controller.read
);
routes.post("/:support", logMiddleware, isSupportMiddleware, controller.create);

export { routes };
