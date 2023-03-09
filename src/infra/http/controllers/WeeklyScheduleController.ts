import { NextFunction, Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { HttpStatus, IResponseMessage } from "@infra/http";
import { CreateWeeklyScheduleLockRequestModel } from "@models/dto/weeklySchedule/CreateWeeklyScheduleLockRequestModel";
import { ListWeeklyScheduleResponseModel } from "@models/dto/weeklySchedule/ListWeeklyScheduleResponseModel";
import { SaveWeeklyScheduleResponseModel } from "@models/dto/weeklySchedule/SaveWeeklyScheduleResponseModel";
import {
  DeleteWeeklyScheduleLockService,
  DisableWeeklyScheduleDayService,
  ListWeeklyScheduleService,
  SaveWeeklyScheduleService,
} from "@services/weeklySchedule";

class WeeklyScheduleController {
  public async read(
    req: Request,
    res: Response<IResponseMessage<ListWeeklyScheduleResponseModel[]>>,
    next: NextFunction
  ): Promise<void> {
    const { id: professionalId } = req.user;
    const { id: clinicId } = req.clinic;

    const service = container.resolve(ListWeeklyScheduleService);

    const result = await service.execute(clinicId, professionalId);

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async readByProfessionalId(
    req: Request,
    res: Response<IResponseMessage<ListWeeklyScheduleResponseModel[]>>,
    next: NextFunction
  ): Promise<void> {
    const { professional_id: professionalId } = req.params;

    const { id: clinicId } = req.clinic;

    const service = container.resolve(ListWeeklyScheduleService);

    const result = await service.execute(clinicId, professionalId);

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async save(
    req: Request,
    res: Response<IResponseMessage<SaveWeeklyScheduleResponseModel | boolean>>,
    next: NextFunction
  ): Promise<void> {
    const { id, startTime, endTime, locks, disableDay, dayOfTheWeek } =
      req.body;

    const { id: clinicId } = req.clinic;
    const { id: professionalId } = req.user;

    const result = await (async (): Promise<
      SaveWeeklyScheduleResponseModel | boolean
    > => {
      if (disableDay && (disableDay === "true" || disableDay === true)) {
        if (stringIsNullOrEmpty(id)) return true;

        const service = container.resolve(DisableWeeklyScheduleDayService);

        const _result = await service.execute({
          clinicId,
          professionalId,
          id,
        });

        return _result;
      }

      const service = container.resolve(SaveWeeklyScheduleService);

      const _result = await service.execute({
        id,
        clinicId,
        professionalId,
        startTime,
        endTime,
        dayOfTheWeek,
        locks: locks?.map(
          (item: any): CreateWeeklyScheduleLockRequestModel => ({
            endTime: item.endTime,
            startTime: item.startTime,
          })
        ),
      });

      return _result;
    })();

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async deleteLock(
    req: Request,
    res: Response<IResponseMessage<boolean>>,
    next: NextFunction
  ): Promise<void> {
    const { id: professionalId } = req.user;

    const { schedule_id: weeklyScheduleId, lock_id: weeklyScheduleLockId } =
      req.params;

    const service = container.resolve(DeleteWeeklyScheduleLockService);

    const result = await service.execute({
      professionalId,
      weeklyScheduleId,
      weeklyScheduleLockId,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }
}

export { WeeklyScheduleController };
