import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { getErrorStackTrace } from "@helpers/getErrorStackTrace";
import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { logger } from "@infra/log";
import { ClinicModel } from "@models/domain/ClinicModel";
import {
  CreateClinicService,
  DeleteClinicService,
  ListClinicsService,
} from "@services/clinic";

class ClinicController {
  public async create(
    req: Request,
    res: Response<IResponseMessage<ClinicModel>>
  ): Promise<Response> {
    try {
      const { name, email } = req.body;

      const service = container.resolve(CreateClinicService);

      const result = await service.execute({
        email,
        name,
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
    res: Response<IResponseMessage<IPaginationResponse<ClinicModel>>>
  ): Promise<Response> {
    try {
      const { page, size } = req.query;

      const service = container.resolve(ListClinicsService);

      const result = await service.execute({ page, size });

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

  public async delete(
    req: Request,
    res: Response<IResponseMessage<boolean>>
  ): Promise<Response> {
    try {
      const { id } = req.params;

      const service = container.resolve(DeleteClinicService);

      const result = await service.execute(id);

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

export { ClinicController };
