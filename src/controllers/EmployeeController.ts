import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { EmployeeModel } from "@models/domain/EmployeeModel";
import { ListEmployeesResponseModel } from "@models/dto/employee/ListEmployeesResponseModel";
import { GetUserProfileResponseModel } from "@models/dto/user/GetUserProfileResponseModel";
import {
  CreateEmployeeService,
  GetEmployeeProfileService,
  SearchEmployeesWithFiltersService,
  SoftEmployeeDeleteService,
  UpdateEmployeeService,
} from "@services/employee";

class EmployeeController {
  public async create(
    req: Request,
    res: Response<IResponseMessage<Partial<EmployeeModel>>>
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
      } = req.body;

      const { id: clinicId } = req.clinic;

      const [service, httpStatusResponse] = stringIsNullOrEmpty(id)
        ? [container.resolve(CreateEmployeeService), HttpStatus.CREATED]
        : [container.resolve(UpdateEmployeeService), HttpStatus.OK];

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

  public async updateProfile(
    req: Request,
    res: Response<IResponseMessage<Partial<EmployeeModel>>>
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

      const { id: userId } = req.user;
      const { id: clinicId } = req.clinic;

      const service = container.resolve(UpdateEmployeeService);

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
              id: address.id,
              state: address.state,
              zipCode: address.zipCode,
              city: address.city,
              district: address.district,
              publicArea: address.publicArea,
            }
          : undefined,
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

  public async read(
    req: Request,
    res: Response<
      IResponseMessage<IPaginationResponse<ListEmployeesResponseModel>>
    >
  ): Promise<Response> {
    try {
      const { page, size } = req.query;
      const { id: clinicId } = req.clinic;

      const { name, CPF, email } = req.body;

      const servicelistEmployeesService = container.resolve(
        SearchEmployeesWithFiltersService
      );

      const result = await servicelistEmployeesService.execute(clinicId, {
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

      const service = container.resolve(SoftEmployeeDeleteService);

      const result = await service.execute(clinicId, id);

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
    res: Response<IResponseMessage<GetUserProfileResponseModel>>
  ): Promise<Response> {
    try {
      const { id: userId } = req.user;
      const { id: clinicId } = req.clinic;

      const service = container.resolve(GetEmployeeProfileService);

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

export { EmployeeController };
