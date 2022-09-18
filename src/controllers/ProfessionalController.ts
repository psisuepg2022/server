import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { GetProfessionalProfileResponseModel } from "@models/dto/professional/GetProfessionalProfileResponseModel";
import { ListProfessionalsResponseModel } from "@models/dto/professional/ListProfessionalsResponseModel";
import {
  CreateProfessionalService,
  GetProfessionalProfileService,
  SearchProfessionalsWithFiltersService,
  SoftProfessionalDeleteService,
  UpdateProfessionalService,
} from "@services/professional";

class ProfessionalController {
  public async create(
    req: Request,
    res: Response<IResponseMessage<Partial<ProfessionalModel>>>
  ): Promise<Response> {
    try {
      const {
        id,
        userName,
        password,
        email,
        name,
        CPF,
        birthDate,
        contactNumber,
        address,
        profession,
        registry,
        specialization,
      } = req.body;

      const { id: clinicId } = req.clinic;

      const [service, httpStatusResponse] = stringIsNullOrEmpty(id)
        ? [container.resolve(CreateProfessionalService), HttpStatus.CREATED]
        : [container.resolve(UpdateProfessionalService), HttpStatus.OK];

      const result = await service.execute({
        id,
        userName,
        birthDate,
        contactNumber,
        name,
        CPF,
        email,
        password,
        clinicId,
        profession,
        registry,
        specialization,
        address: address
          ? {
              id: address.id,
              state: address.state,
              zipCode: address.zipCode,
              city: address.city,
              district: address.district,
              publicArea: address.publicArea,
            }
          : undefined,
      });

      return res.status(httpStatusResponse).json({
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
      IResponseMessage<IPaginationResponse<ListProfessionalsResponseModel>>
    >
  ): Promise<Response> {
    try {
      const { page, size } = req.query;
      const { id: clinicId } = req.clinic;

      const { name, CPF, email } = req.body;

      const listProfessionalsService = container.resolve(
        SearchProfessionalsWithFiltersService
      );

      const result = await listProfessionalsService.execute(clinicId, {
        page,
        size,
        filters: {
          name,
          CPF,
          email,
        },
      });

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

  public async delete(
    req: Request,
    res: Response<IResponseMessage<boolean>>
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const { id: clinicId } = req.clinic;

      const softDeleteService = container.resolve(
        SoftProfessionalDeleteService
      );

      const result = await softDeleteService.execute(clinicId, id);

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

  public async getProfile(
    req: Request,
    res: Response<IResponseMessage<GetProfessionalProfileResponseModel>>
  ): Promise<Response> {
    try {
      const { id: userId } = req.user;
      const { id: clinicId } = req.clinic;

      const service = container.resolve(GetProfessionalProfileService);

      const result = await service.execute({
        clinicId,
        userId,
      });

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

export { ProfessionalController };
