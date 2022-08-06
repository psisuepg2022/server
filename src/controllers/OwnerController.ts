import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { OwnerModel } from "@models/domain/OwnerModel";
import { ListOwnersResponseModel } from "@models/dto/owner/ListOwnersRespondeModel";
import {
  CreateOwnerService,
  SearchOwnersWithFiltersService,
} from "@services/owner";

class OwnerController {
  public async create(
    req: Request,
    res: Response<IResponseMessage<Partial<OwnerModel>>>
  ): Promise<Response> {
    try {
      const {
        userName,
        password,
        email,
        name,
        CPF,
        birthDate,
        contactNumber,
        address,
      } = req.body;

      const { id: clinicId } = req.clinic;

      const createOwnerService = container.resolve(CreateOwnerService);

      const result = await createOwnerService.execute({
        userName,
        birthDate,
        contactNumber,
        name,
        CPF,
        email,
        password,
        clinicId,
        address: address
          ? {
              state: address.state,
              zipCode: address.zipCode,
              city: address.city,
              district: address.district,
              publicArea: address.publicArea,
            }
          : undefined,
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

  public async read(
    req: Request,
    res: Response<
      IResponseMessage<IPaginationResponse<ListOwnersResponseModel>>
    >
  ): Promise<Response> {
    try {
      const { page, size } = req.query;
      const { clinic_id: clinicId } = req.params;

      const listOwnersService = container.resolve(
        SearchOwnersWithFiltersService
      );

      const result = await listOwnersService.execute(clinicId, { page, size });

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

export { OwnerController };
