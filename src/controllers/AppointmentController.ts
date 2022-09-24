import { NextFunction, Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
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
    res: Response<IResponseMessage<CreateAppointmentResponseModel>>,
    next: NextFunction
  ): Promise<void> {
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

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async getCalendar(
    req: Request,
    res: Response<IResponseMessage<GetCalendarResponseModel>>,
    next: NextFunction
  ): Promise<void> {
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

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async getCalendarByProfessional(
    req: Request,
    res: Response<IResponseMessage<GetCalendarResponseModel>>,
    next: NextFunction
  ): Promise<void> {
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

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async autocompletePatient(
    req: Request,
    res: Response<
      IResponseMessage<IPaginationResponse<AutocompletePatientResponseModel>>
    >,
    next: NextFunction
  ): Promise<void> {
    const { id: clinicId } = req.clinic;
    const { name } = req.body;

    const service = container.resolve(AutocompletePatientService);

    const result = await service.execute({
      name,
      clinicId,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async updateStatus(
    req: Request,
    res: Response<IResponseMessage<AppointmentOnCalendarModel | null>>,
    next: NextFunction
  ): Promise<void> {
    const { status } = req.body;
    const { id } = req.params;

    const service = container.resolve(UpdateStatusService);

    const result = await service.execute({
      id,
      status,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async getById(
    req: Request,
    res: Response<IResponseMessage<GetAppointmentResponseModel>>,
    next: NextFunction
  ): Promise<void> {
    const { id: professionalId } = req.user;
    const { appointment_id: appointmentId } = req.params;

    const service = container.resolve(GetAppointmentService);

    const result = await service.execute({
      professionalId,
      appointmentId,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }
}

export { AppointmentController };
