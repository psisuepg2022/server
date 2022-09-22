import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { getErrorStackTrace } from "@helpers/getErrorStackTrace";
import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { logger } from "@infra/log";
import { AutocompletePatientResponseModel } from "@models/dto/appointment/AutocompletePatientResponseModel";
import { CreateAppointmentResponseModel } from "@models/dto/appointment/CreateAppointmentResponseModel";
import { GetAppointmentResponseModel } from "@models/dto/appointment/GetAppointmentResponseModel";
import { AppointmentOnCalendarModel } from "@models/dto/calendar/AppointmentOnCalendarModel";
import { GetCalendarResponseModel } from "@models/dto/calendar/GetCalendarResponseModel";
import {
  AutocompletePatientService,
  CreateAppointmentService,
  GetAppointmentService,
  UpdateStatusService,
} from "@services/appointment";
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
      logger.error(getErrorStackTrace(error));
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
      const { weekly: returnWeeklySchedule } = req.query;

      const service = container.resolve(GetCalendarService);

      const result = await service.execute({
        professionalId,
        clinicId,
        endDate,
        startDate,
        returnWeeklySchedule: returnWeeklySchedule === "true",
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

  public async getCalendarByProfessional(
    req: Request,
    res: Response<IResponseMessage<GetCalendarResponseModel>>
  ): Promise<Response> {
    try {
      const { professional_id: professionalId } = req.params;
      const { id: clinicId } = req.clinic;
      const { startDate, endDate } = req.body;
      const { weekly: returnWeeklySchedule } = req.query;

      const service = container.resolve(GetCalendarService);

      const result = await service.execute({
        professionalId,
        clinicId,
        endDate,
        startDate,
        returnWeeklySchedule: returnWeeklySchedule === "true",
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

  public async autocompletePatient(
    req: Request,
    res: Response<
      IResponseMessage<IPaginationResponse<AutocompletePatientResponseModel>>
    >
  ): Promise<Response> {
    try {
      const { id: clinicId } = req.clinic;
      const { name } = req.body;

      const service = container.resolve(AutocompletePatientService);

      const result = await service.execute({
        name,
        clinicId,
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

  public async updateStatus(
    req: Request,
    res: Response<IResponseMessage<AppointmentOnCalendarModel>>
  ): Promise<Response> {
    try {
      const { status } = req.body;
      const { id } = req.params;

      const service = container.resolve(UpdateStatusService);

      const result = await service.execute({
        id,
        status,
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

  public async getById(
    req: Request,
    res: Response<IResponseMessage<GetAppointmentResponseModel>>
  ): Promise<Response> {
    try {
      const { id: professionalId } = req.user;
      const { appointment_id: appointmentId } = req.params;

      const service = container.resolve(GetAppointmentService);

      const result = await service.execute({
        professionalId,
        appointmentId,
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
}

export { AppointmentController };
