import { NextFunction, Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { HttpStatus, IResponseMessage } from "@infra/http";
import { CreateScheduleLockResponseModel } from "@models/dto/scheduleLock/CreateScheduleLockResponseModel";
import {
  CreateScheduleLockService,
  DeleteScheduleLockService,
} from "@services/scheduleLocks";

class ScheduleLockController {
  public async save(
    req: Request,
    res: Response<IResponseMessage<CreateScheduleLockResponseModel>>,
    next: NextFunction
  ): Promise<void> {
    const { id: professionalId } = req.user;
    const { id: clinicId } = req.clinic;

    const { date, startTime, endTime } = req.body;

    const service = container.resolve(CreateScheduleLockService);

    const result = await service.execute({
      professionalId,
      clinicId,
      date,
      endTime,
      startTime,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async saveByProfessional(
    req: Request,
    res: Response<IResponseMessage<CreateScheduleLockResponseModel>>,
    next: NextFunction
  ): Promise<void> {
    const { professional_id: professionalId } = req.params;
    const { id: clinicId } = req.clinic;

    const { date, startTime, endTime } = req.body;

    const service = container.resolve(CreateScheduleLockService);

    const result = await service.execute({
      professionalId,
      clinicId,
      date,
      endTime,
      startTime,
    });

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
    const { id: professionalId } = req.user;

    const service = container.resolve(DeleteScheduleLockService);

    const result = await service.execute(professionalId, id);

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async deleteByProfessional(
    req: Request,
    res: Response<IResponseMessage<boolean>>,
    next: NextFunction
  ): Promise<void> {
    const { id, professional_id: professionalId } = req.params;

    const service = container.resolve(DeleteScheduleLockService);

    const result = await service.execute(professionalId, id);

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }
}

export { ScheduleLockController };
