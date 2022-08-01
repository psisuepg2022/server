import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { HttpStatus, IResponseMessage } from "@infra/http";
import { ListWeeklyScheduleModel } from "@models/dto/weeklySchedule/ListWeeklyScheduleModel";
import { ListWeeklyScheduleService } from "@services/weeklySchedule";

class WeeklyScheduleController {
  public async read(
    req: Request,
    res: Response<IResponseMessage<ListWeeklyScheduleModel[]>>
  ): Promise<Response> {
    try {
      const { id: professionalId } = req.user;

      const listWeeklyScheduleService = container.resolve(
        ListWeeklyScheduleService
      );

      const result = await listWeeklyScheduleService.execute(professionalId);

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
    res: Response<IResponseMessage<ListWeeklyScheduleModel[]>>
  ): Promise<Response> {
    try {
      const { professional_id: professionalId } = req.params;

      const listWeeklyScheduleService = container.resolve(
        ListWeeklyScheduleService
      );

      const result = await listWeeklyScheduleService.execute(professionalId);

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
      return res.status(HttpStatus.OK).json({
        success: true,
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
