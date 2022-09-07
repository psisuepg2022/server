import { Request, Response } from "express";
import i18n from "i18n";

import { AppError } from "@handlers/error/AppError";
import { HttpStatus, IResponseMessage } from "@infra/http";

class CommentsController {
  public async create(
    req: Request,
    res: Response<IResponseMessage>
  ): Promise<Response> {
    try {
      return res.status(HttpStatus.CREATED).json({
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

export { CommentsController };
