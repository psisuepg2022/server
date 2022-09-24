import { NextFunction, Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { ClinicModel } from "@models/domain/ClinicModel";
import {
  CreateClinicService,
  DeleteClinicService,
  ListClinicsService,
} from "@services/clinic";

class ClinicController {
  public async create(
    req: Request,
    res: Response<IResponseMessage<ClinicModel>>,
    next: NextFunction
  ): Promise<void> {
    const { name, email } = req.body;

    const service = container.resolve(CreateClinicService);

    const result = await service.execute({
      email,
      name,
    });

    res.status(HttpStatus.CREATED).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async read(
    req: Request,
    res: Response<IResponseMessage<IPaginationResponse<ClinicModel>>>,
    next: NextFunction
  ): Promise<void> {
    const { page, size } = req.query;

    const service = container.resolve(ListClinicsService);

    const result = await service.execute({ page, size });

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async delete(
    req: Request,
    res: Response<IResponseMessage<boolean>>,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    const service = container.resolve(DeleteClinicService);

    const result = await service.execute(id);

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }
}

export { ClinicController };
