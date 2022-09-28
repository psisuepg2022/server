import { NextFunction, Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { CreateCommentResponseModel } from "@models/dto/comments/CreateCommentResponseModel";
import {
  CreateCommentService,
  SearchCommentsWithFiltersService,
} from "@services/comments";

class CommentsController {
  public async create(
    req: Request,
    res: Response<IResponseMessage<CreateCommentResponseModel>>,
    next: NextFunction
  ): Promise<void> {
    const { id: professionalId } = req.user;
    const { id: appointmentId } = req.params;
    const { text, blankComments } = req.body;

    const service = container.resolve(CreateCommentService);

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
        filters: appointmentDate,
      }
    );

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }
}

export { CommentsController };
