import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { getErrorStackTrace } from "@helpers/getErrorStackTrace";
import { HttpStatus, IResponseMessage } from "@infra/http";
import { logger } from "@infra/log";
import { CreateScheduleLockResponseModel } from "@models/dto/scheduleLock/CreateScheduleLockResponseModel";
import {
  CreateScheduleLockService,
  DeleteScheduleLockService,
} from "@services/scheduleLocks";

class ScheduleLockController {
  public async save(
    req: Request,
    res: Response<IResponseMessage<CreateScheduleLockResponseModel>>
  ): Promise<Response> {
    try {
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

      return res.status(HttpStatus.OK).json({
        success: true,
        content: result,
        message: i18n.__("SuccessGeneric"),
      });
    } catch (error) {
      logger.error(getErrorStackTrace(error));
      return res.status(AppError.getErrorStatusCode(error)).json({
        success: false,
        message: AppError.getErrorMessage(error),
      });
    }
  }

  public async saveByProfessional(
    req: Request,
    res: Response<IResponseMessage<CreateScheduleLockResponseModel>>
  ): Promise<Response> {
    try {
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

      return res.status(HttpStatus.OK).json({
        success: true,
        content: result,
        message: i18n.__("SuccessGeneric"),
      });
    } catch (error) {
      logger.error(getErrorStackTrace(error));
      return res.status(AppError.getErrorStatusCode(error)).json({
        success: false,
        message: AppError.getErrorMessage(error),
      });
    }
  }

  public async delete(
    req: Request,
    res: Response<IResponseMessage<boolean>>
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const { id: professionalId } = req.user;

      const service = container.resolve(DeleteScheduleLockService);

      const result = await service.execute(professionalId, id);

      return res.status(HttpStatus.OK).json({
        success: true,
        content: result,
        message: i18n.__("SuccessGeneric"),
      });
    } catch (error) {
      logger.error(getErrorStackTrace(error));
      return res.status(AppError.getErrorStatusCode(error)).json({
        success: false,
        message: AppError.getErrorMessage(error),
      });
    }
  }

  public async deleteByProfessional(
    req: Request,
    res: Response<IResponseMessage<boolean>>
  ): Promise<Response> {
    try {
      const { id, professional_id: professionalId } = req.params;

      const service = container.resolve(DeleteScheduleLockService);

      const result = await service.execute(professionalId, id);

      return res.status(HttpStatus.OK).json({
        success: true,
        content: result,
        message: i18n.__("SuccessGeneric"),
      });
    } catch (error) {
      logger.error(getErrorStackTrace(error));
      return res.status(AppError.getErrorStatusCode(error)).json({
        success: false,
        message: AppError.getErrorMessage(error),
      });
    }
  }
}

export { ScheduleLockController };
