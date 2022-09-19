import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { getErrorStackTrace } from "@helpers/getErrorStackTrace";
import { HttpStatus, IResponseMessage } from "@infra/http";
import { logger } from "@infra/log";
import { LoginResponseModel } from "@models/dto/auth/LoginResponseModel";
import { LoginService, ResetPasswordService } from "@services/auth";
import { RefreshTokenService } from "@services/auth/RefreshTokenService";

class AuthController {
  public async login(
    req: Request,
    res: Response<IResponseMessage<LoginResponseModel>>
  ): Promise<Response> {
    try {
      const { userName, password, accessCode } = req.body;

      const service = container.resolve(LoginService);

      const result = await service.execute({
        accessCode,
        password,
        userName,
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

  public async refreshToken(
    req: Request,
    res: Response<IResponseMessage<LoginResponseModel>>
  ): Promise<Response> {
    try {
      const { refreshToken } = req.body;

      const service = container.resolve(RefreshTokenService);

      const result = await service.execute(refreshToken);

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

  public async resetPassword(
    req: Request,
    res: Response<IResponseMessage<boolean>>
  ): Promise<Response> {
    try {
      const { id: userId } = req.user;
      const { id: clinicId } = req.clinic;
      const { oldPassword, newPassword, confirmNewPassword } = req.body;

      const service = container.resolve(ResetPasswordService);

      const result = await service.execute({
        clinicId,
        confirmNewPassword,
        newPassword,
        oldPassword,
        userId,
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

export { AuthController };
