import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { OwnerModel } from "@models/domain/OwnerModel";
import { ListOwnersResponseModel } from "@models/dto/owner/ListOwnersRespondeModel";
import { CreateOwnerService, ListOwnersService } from "@services/owner";

class OwnerController {
  public async create(
    req: Request,
    res: Response<IResponseMessage<Partial<OwnerModel>>>
  ): Promise<Response> {
    try {
      const {
        user_name: userName,
        password,
        email,
        name,
        CPF,
        birth_date: birthDate,
        contact_number: contactNumber,
        address,
        clinicId,
      } = req.body;

      const createOwnerService = container.resolve(CreateOwnerService);

      const result = await createOwnerService.execute({
        userName,
        birthDate: new Date(birthDate),
        contactNumber,
        name,
        CPF,
        email,
        password,
        clinicId,
        address: address
          ? {
              city: address.city,
              district: address.district,
              publicArea: address.public_area,
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

      const listOwnersService = container.resolve(ListOwnersService);

      const result = await listOwnersService.execute({ page, size });

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
