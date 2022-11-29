import { NextFunction, Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { GetClinicsReponseModel } from "@models/dto/auth/GetClinicsReponseModel";
import { LoginResponseModel } from "@models/dto/auth/LoginResponseModel";
import {
  GetClinicsService,
  LoginService,
  ResetAnotherUserPasswordService,
  ResetPasswordService,
} from "@services/auth";
import { RefreshTokenService } from "@services/auth/RefreshTokenService";

class AuthController {
  public async login(
    req: Request,
    res: Response<IResponseMessage<LoginResponseModel>>,
    next: NextFunction
  ): Promise<void> {
    const { userName, password, accessCode } = req.body;

    const service = container.resolve(LoginService);

    const result = await service.execute({
      accessCode,
      password,
      userName,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async refreshToken(
    req: Request,
    res: Response<IResponseMessage<LoginResponseModel>>,
    next: NextFunction
  ): Promise<void> {
    const { refreshToken } = req.body;

    const service = container.resolve(RefreshTokenService);

    const result = await service.execute(refreshToken);

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async getClinics(
    req: Request,
    res: Response<
      IResponseMessage<IPaginationResponse<GetClinicsReponseModel>>
    >,
    next: NextFunction
  ): Promise<void> {
    const service = container.resolve(GetClinicsService);

    const result = await service.execute();

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async resetPassword(
    req: Request,
    res: Response<IResponseMessage<boolean>>,
    next: NextFunction
  ): Promise<void> {
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

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async resetAnotherUserPassword(
    req: Request,
    res: Response<IResponseMessage<boolean>>,
    next: NextFunction
  ): Promise<void> {
    const { id: clinicId } = req.clinic;
    const { newPassword, confirmNewPassword } = req.body;
    const { user_id: userId } = req.params;

    const service = container.resolve(ResetAnotherUserPasswordService);

    const result = await service.execute({
      clinicId,
      confirmNewPassword,
      newPassword,
      userId,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }
}

export { AuthController };
