import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { ListProfessionalsResponseModel } from "@models/dto/professional/ListProfessionalsResponseModel";
import { CreateProfessionalService } from "@services/professional";
import { ListProfessionalsService } from "@services/professional/ListProfessionalsService";

class ProfessionalController {
  public async create(
    req: Request,
    res: Response<IResponseMessage<Partial<ProfessionalModel>>>
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
        clinicId,
        profession,
        registry,
        specialization,
      } = req.body;

      const createProfessionalService = container.resolve(
        CreateProfessionalService
      );

      const result = await createProfessionalService.execute({
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
      IResponseMessage<IPaginationResponse<ListProfessionalsResponseModel>>
    >
  ): Promise<Response> {
    try {
      const { page, size } = req.query;
      const { id: clinicId } = req.clinic;

      const listProfessionalsService = container.resolve(
        ListProfessionalsService
      );

      const result = await listProfessionalsService.execute(clinicId, {
        page,
        size,
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

      console.log(id);

      return res.status(HttpStatus.OK).json({
        success: true,
        content: true,
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
