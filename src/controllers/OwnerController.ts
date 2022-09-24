import { NextFunction, Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { OwnerModel } from "@models/domain/OwnerModel";
import { ListOwnersResponseModel } from "@models/dto/owner/ListOwnersRespondeModel";
import { GetUserProfileResponseModel } from "@models/dto/user/GetUserProfileResponseModel";
import {
  CreateOwnerService,
  GetOwnerProfileService,
  SearchOwnersWithFiltersService,
  UpdateOwnerService,
} from "@services/owner";

class OwnerController {
  public async create(
    req: Request,
    res: Response<IResponseMessage<Partial<OwnerModel>>>,
    next: NextFunction
  ): Promise<void> {
    const {
      userName,
      password,
      email,
      name,
      CPF,
      birthDate,
      contactNumber,
      address,
      clinicId,
    } = req.body;

    const service = container.resolve(CreateOwnerService);

    const result = await service.execute({
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

    res.status(HttpStatus.CREATED).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async updateProfile(
    req: Request,
    res: Response<IResponseMessage<Partial<OwnerModel>>>,
    next: NextFunction
  ): Promise<void> {
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

    const { id: userId } = req.user;
    const { id: clinicId } = req.clinic;

    const service = container.resolve(UpdateOwnerService);

    const result = await service.execute({
      id: userId,
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

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async read(
    req: Request,
    res: Response<
      IResponseMessage<IPaginationResponse<ListOwnersResponseModel>>
    >,
    next: NextFunction
  ): Promise<void> {
    const { page, size } = req.query;
    const { clinic_id: clinicId } = req.params;

    const service = container.resolve(SearchOwnersWithFiltersService);

    const result = await service.execute(clinicId, { page, size });

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async getProfile(
    req: Request,
    res: Response<IResponseMessage<GetUserProfileResponseModel>>,
    next: NextFunction
  ): Promise<void> {
    const { id: userId } = req.user;
    const { id: clinicId } = req.clinic;

    const service = container.resolve(GetOwnerProfileService);

    const result = await service.execute({
      clinicId,
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

export { OwnerController };
