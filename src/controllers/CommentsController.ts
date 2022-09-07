import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { HttpStatus, IResponseMessage } from "@infra/http";
import { CreateCommentResponseModel } from "@models/dto/comments/CreateCommentResponseModel";
import { CreateCommentService } from "@services/comments";

class CommentsController {
  public async create(
    req: Request,
    res: Response<IResponseMessage<CreateCommentResponseModel>>
  ): Promise<Response> {
    try {
      const { id: professionalId } = req.user;
      const { id: appointmentId } = req.params;
      const { text } = req.body;

      const service = container.resolve(CreateCommentService);

      const result = await service.execute({
        appointmentId,
        professionalId,
        text,
      });

      return res.status(HttpStatus.CREATED).json({
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

export { CommentsController };
