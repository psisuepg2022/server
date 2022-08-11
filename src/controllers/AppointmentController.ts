import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { HttpStatus, IResponseMessage } from "@infra/http";
import { CreateAppointmentResponseModel } from "@models/dto/appointment/CreateAppointmentResponseModel";
import { CreateAppointmentService } from "@services/appointment";

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
}

export { AppointmentController };
