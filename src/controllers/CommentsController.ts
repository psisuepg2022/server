import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { getErrorStackTrace } from "@helpers/getErrorStackTrace";
import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { logger } from "@infra/log";
import { CreateCommentResponseModel } from "@models/dto/comments/CreateCommentResponseModel";
import { GetAppointmentCommentsResponseModel } from "@models/dto/comments/GetAppointmentCommentsResponseModel";
import {
  CreateCommentService,
  GetAppointmentCommentsService,
  ListCommentsService,
} from "@services/comments";

class CommentsController {
  public async create(
    req: Request,
    res: Response<IResponseMessage<CreateCommentResponseModel>>
  ): Promise<Response> {
    try {
      const { id: professionalId } = req.user;
      const { id: appointmentId } = req.params;
      const { text, blankComments } = req.body;

      const service = container.resolve(CreateCommentService);

      const result = await service.execute({
        appointmentId,
        professionalId,
        text,
        blankComments: blankComments === "true",
      });

      return res.status(HttpStatus.CREATED).json({
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

  public async read(
    req: Request,
    res: Response<
      IResponseMessage<IPaginationResponse<ListCommentsResponseModel>>
    >
  ): Promise<Response> {
    try {
      const { page, size } = req.query;
      const { id: professionalId } = req.user;
      const { patient_id: patientId } = req.params;

      const service = container.resolve(ListCommentsService);

      const result = await service.execute(
        {
          patientId,
          professionalId,
        },
        {
          page,
          size,
        }
      );

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
    res: Response<IResponseMessage<GetAppointmentCommentsResponseModel>>
  ): Promise<Response> {
    try {
      const { id: professionalId } = req.user;
      const { appointment_id: appointmentId } = req.params;

      const service = container.resolve(GetAppointmentCommentsService);

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

export { CommentsController };
