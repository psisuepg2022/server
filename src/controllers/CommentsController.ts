import { NextFunction, Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { SaveCommentResponseModel } from "@models/dto/comments/SaveCommentResponseModel";
import {
  GetPdfOfCommentsService,
  SaveCommentService,
  SearchCommentsWithFiltersService,
} from "@services/comments";

class CommentsController {
  public async save(
    req: Request,
    res: Response<IResponseMessage<SaveCommentResponseModel>>,
    next: NextFunction
  ): Promise<void> {
    const { id: professionalId } = req.user;
    const { id: appointmentId } = req.params;
    const { text, blankComments } = req.body;

    const service = container.resolve(SaveCommentService);

    const result = await service.execute({
      appointmentId,
      professionalId,
      text,
      blankComments: blankComments === "true" || blankComments === true,
    });

    res.status(HttpStatus.CREATED).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async read(
    req: Request,
    res: Response<
      IResponseMessage<IPaginationResponse<ListCommentsResponseModel>>
    >,
    next: NextFunction
  ): Promise<void> {
    const { page, size } = req.query;
    const { id: professionalId } = req.user;
    const { patient_id: patientId } = req.params;

    const { appointmentDate } = req.body;

    const service = container.resolve(SearchCommentsWithFiltersService);

    const result = await service.execute(
      {
        patientId,
        professionalId,
      },
      {
        page,
        size,
        filters: { appointmentDate },
      }
    );

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async getPdf(
    req: Request,
    res: Response<IResponseMessage<Buffer>>,
    next: NextFunction
  ): Promise<void> {
    const { id: professionalId } = req.user;
    const { appointment_id: appointmentId } = req.params;

    const service = container.resolve(GetPdfOfCommentsService);

    const result = await service.execute({ appointmentId, professionalId });

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }
}

export { CommentsController };
