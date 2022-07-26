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
        user_name: userName,
        password,
        email,
        name,
        CPF,
        birth_date: birthDate,
        contact_number: contactNumber,
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
        birthDate: new Date(birthDate),
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
              zipCode: address.zip_code,
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
      IResponseMessage<IPaginationResponse<ListProfessionalsResponseModel>>
    >
  ): Promise<Response> {
    try {
      const { page, size } = req.query;

      const listProfessionalsService = container.resolve(
        ListProfessionalsService
      );

      const result = await listProfessionalsService.execute({ page, size });

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
