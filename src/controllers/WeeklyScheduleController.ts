import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { HttpStatus, IResponseMessage } from "@infra/http";
import { CreateWeeklyScheduleLockRequestModel } from "@models/dto/weeklySchedule/CreateWeeklyScheduleLockRequestModel";
import { ListWeeklyScheduleResponseModel } from "@models/dto/weeklySchedule/ListWeeklyScheduleResponseModel";
import { SaveWeeklyScheduleResponseModel } from "@models/dto/weeklySchedule/SaveWeeklyScheduleResponseModel";
import {
  DeleteWeeklyScheduleLockService,
  ListWeeklyScheduleService,
  SaveWeeklyScheduleService,
} from "@services/weeklySchedule";

class WeeklyScheduleController {
  public async read(
    req: Request,
    res: Response<IResponseMessage<ListWeeklyScheduleResponseModel[]>>
  ): Promise<Response> {
    try {
      const { id: professionalId } = req.user;
      const { id: clinicId } = req.clinic;

      const listWeeklyScheduleService = container.resolve(
        ListWeeklyScheduleService
      );

      const result = await listWeeklyScheduleService.execute(
        clinicId,
        professionalId
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        content: result,
        message: i18n.__("SuccessGeneric"),
      });
    } catch (error) {
      return res.status(AppError.getErrorStatusCode(error)).json({
        success: false,
        message: AppError.getErrorMessage(error),
      });
    }
  }

  public async readByProfessionalId(
    req: Request,
    res: Response<IResponseMessage<ListWeeklyScheduleResponseModel[]>>
  ): Promise<Response> {
    try {
      const { professional_id: professionalId } = req.params;

      const { id: clinicId } = req.clinic;

      const listWeeklyScheduleService = container.resolve(
        ListWeeklyScheduleService
      );

      const result = await listWeeklyScheduleService.execute(
        clinicId,
        professionalId
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        content: result,
        message: i18n.__("SuccessGeneric"),
      });
    } catch (error) {
      return res.status(AppError.getErrorStatusCode(error)).json({
        success: false,
        message: AppError.getErrorMessage(error),
      });
    }
  }

  public async save(
    req: Request,
    res: Response<IResponseMessage<SaveWeeklyScheduleResponseModel>>
  ): Promise<Response> {
    try {
      const { id, startTime, endTime, baseDuration, locks } = req.body;

      const { id: professionalId } = req.user;

      const saveWeeklyScheduleService = container.resolve(
        SaveWeeklyScheduleService
      );

      const result = await saveWeeklyScheduleService.execute({
        id,
        professionalId,
        startTime,
        endTime,
        baseDuration,
        locks: locks?.map(
          (item: any): CreateWeeklyScheduleLockRequestModel => ({
            endTime: item.endTime,
            startTime: item.startTime,
          })
        ),
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        content: result,
        message: i18n.__("SuccessGeneric"),
      });
    } catch (error) {
      return res.status(AppError.getErrorStatusCode(error)).json({
        success: false,
        message: AppError.getErrorMessage(error),
      });
    }
  }

  public async deleteLock(
    req: Request,
    res: Response<IResponseMessage<boolean>>
  ): Promise<Response> {
    try {
      const { id: professionalId } = req.user;

      const { schedule_id: weeklyScheduleId, lock_id: weeklyScheduleLockId } =
        req.params;

      const deleteWeeklyScheduleLockService = container.resolve(
        DeleteWeeklyScheduleLockService
      );

      const result = await deleteWeeklyScheduleLockService.execute({
        professionalId,
        weeklyScheduleId,
        weeklyScheduleLockId,
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        content: result,
        message: i18n.__("SuccessGeneric"),
      });
    } catch (error) {
      return res.status(AppError.getErrorStatusCode(error)).json({
        success: false,
        message: AppError.getErrorMessage(error),
      });
    }
  }
}

export { WeeklyScheduleController };
