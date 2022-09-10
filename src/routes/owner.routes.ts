import { Router } from "express";
import { container } from "tsyringe";

import { OwnerController } from "@controllers/OwnerController";
import { isSupportMiddleware } from "@middlewares/isSupportMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new OwnerController();
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);

routes.get(
  "/:support/:clinic_id",
  isSupportMiddleware,
  validateClinicID.execute(false, false, "clinic_id"),
  controller.read
);
routes.post("/:support", isSupportMiddleware, controller.create);

export { routes };
