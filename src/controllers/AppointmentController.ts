import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { HttpStatus, IResponseMessage } from "@infra/http";
import { CreateAppointmentResponseModel } from "@models/dto/appointment/CreateAppointmentResponseModel";
import { GetCalendarResponseModel } from "@models/dto/calendar/GetCalendarResponseModel";
import { CreateAppointmentService } from "@services/appointment";
import { GetCalendarService } from "@services/calendar";

class AppointmentController {
  public async save(
    req: Request,
    res: Response<IResponseMessage<CreateAppointmentResponseModel>>
  ): Promise<Response> {
    try {
      const { id: employeeId } = req.user;
      const { id: clinicId } = req.clinic;
      const { date, startTime, endTime, professionalId, patientId } = req.body;

      const service = container.resolve(CreateAppointmentService);

      const result = await service.execute({
        clinicId,
        date,
        employeeId,
        endTime,
        patientId,
        professionalId,
        startTime,
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

  public async getCalendar(
    req: Request,
    res: Response<IResponseMessage<GetCalendarResponseModel>>
  ): Promise<Response> {
    try {
      const { id: professionalId } = req.user;
      const { id: clinicId } = req.clinic;
      const { startDate, endDate } = req.body;

      const service = container.resolve(GetCalendarService);

      const result = await service.execute({
        professionalId,
        clinicId,
        endDate,
        startDate,
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

  public async getCalendarByProfessional(
    req: Request,
    res: Response<IResponseMessage<GetCalendarResponseModel>>
  ): Promise<Response> {
    try {
      const { professional_id: professionalId } = req.params;
      const { id: clinicId } = req.clinic;
      const { startDate, endDate } = req.body;

      const service = container.resolve(GetCalendarService);

      const result = await service.execute({
        professionalId,
        clinicId,
        endDate,
        startDate,
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

export { AppointmentController };
