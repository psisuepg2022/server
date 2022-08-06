import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { EmployeeModel } from "@models/domain/EmployeeModel";
import { ListEmployeesResponseModel } from "@models/dto/employee/ListEmployeesResponseModel";
import {
  CreateEmployeeService,
  SearchEmployeesWithFiltersService,
  SoftEmployeeDeleteService,
} from "@services/employee";

class EmployeeController {
  public async create(
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
        clinicId,
      } = req.body;

      const createEmployeeService = container.resolve(CreateEmployeeService);

      const result = await createEmployeeService.execute({
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
      IResponseMessage<IPaginationResponse<ListEmployeesResponseModel>>
    >
  ): Promise<Response> {
    try {
      const { page, size } = req.query;
      const { id: clinicId } = req.clinic;

      const { name, CPF, email } = req.body;

      const listEmployeesService = container.resolve(
        SearchEmployeesWithFiltersService
      );

      const result = await listEmployeesService.execute(clinicId, {
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

      const softDeleteService = container.resolve(SoftEmployeeDeleteService);

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
}

export { EmployeeController };
