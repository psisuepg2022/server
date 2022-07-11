import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { PatientModel } from "@models/domain/PatientModel";
import { ListPatientsResponseModel } from "@models/dto/patient/ListPatientsResponseModel";
import { CreatePatientService, ListPatientsService } from "@services/patient";

class PatientController {
  public async create(
    req: Request,
    res: Response<IResponseMessage<Partial<PatientModel>>>
  ): Promise<Response> {
    try {
      const {
        email,
        name,
        CPF,
        birth_date: birthDate,
        contact_number: contactNumber,
        address,
        clinicId,
        gender,
        marital_status: maritalStatus,
      } = req.body;

      const createPatientService = container.resolve(CreatePatientService);

      const result = await createPatientService.execute({
        email,
        name,
        birthDate: new Date(birthDate),
        CPF,
        contactNumber,
        gender,
        maritalStatus,
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
      IResponseMessage<IPaginationResponse<ListPatientsResponseModel>>
    >
  ): Promise<Response> {
    try {
      const { page, size } = req.query;

      const listPatientsService = container.resolve(ListPatientsService);

      const result = await listPatientsService.execute({ page, size });

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
      return res.status(HttpStatus.OK).json({
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

export { PatientController };
