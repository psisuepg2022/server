import { NextFunction, Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { PatientModel } from "@models/domain/PatientModel";
import { ListPatientsResponseModel } from "@models/dto/patient/ListPatientsResponseModel";
import { ListPeopleResponseModel } from "@models/dto/person/ListPeopleResponseModel";
import {
  CreatePatientService,
  SearchPatientsWithFiltersService,
  SoftPatientDeleteService,
  UpdatePatientService,
} from "@services/patient";
import { SearchLiablesWithFiltersService } from "@services/patient/SearchLiablesWithFiltersService";

class PatientController {
  public async save(
    req: Request,
    res: Response<IResponseMessage<Partial<PatientModel>>>,
    next: NextFunction
  ): Promise<void> {
    const {
      id,
      email,
      name,
      CPF,
      birthDate,
      contactNumber,
      address,
      gender,
      maritalStatus,
      liableRequired,
      liable,
    } = req.body;

    const { id: clinicId } = req.clinic;

    const [service, httpStatusResponse] = stringIsNullOrEmpty(id)
      ? [container.resolve(CreatePatientService), HttpStatus.CREATED]
      : [container.resolve(UpdatePatientService), HttpStatus.OK];

    const result = await service.execute(
      {
        id,
        email,
        name,
        birthDate,
        CPF,
        contactNumber,
        gender,
        maritalStatus,
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
      },
      liableRequired === true
        ? {
            birthDate: liable?.birthDate,
            CPF: liable?.CPF,
            contactNumber: liable?.contactNumber,
            name: liable?.name,
            email: liable?.email,
            clinicId,
            id: liable?.id,
          }
        : null
    );

    res.status(httpStatusResponse).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async read(
    req: Request,
    res: Response<
      IResponseMessage<IPaginationResponse<ListPatientsResponseModel>>
    >,
    next: NextFunction
  ): Promise<void> {
    const { page, size } = req.query;
    const { id: clinicId } = req.clinic;

    const { name, CPF, email, composed } = req.body;

    const service = container.resolve(SearchPatientsWithFiltersService);

    const result = await service.execute(clinicId, {
      page,
      size,
      filters: {
        CPF,
        email,
        name,
        composed,
      },
    });

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async readLiable(
    req: Request,
    res: Response<
      IResponseMessage<IPaginationResponse<ListPeopleResponseModel>>
    >,
    next: NextFunction
  ): Promise<void> {
    const { page, size } = req.query;
    const { id: clinicId } = req.clinic;

    const { name, CPF, email, composed } = req.body;

    const service = container.resolve(SearchLiablesWithFiltersService);

    const result = await service.execute(clinicId, {
      page,
      size,
      filters: {
        name,
        CPF,
        email,
        composed,
      },
    });

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async delete(
    req: Request,
    res: Response<IResponseMessage>,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const { id: clinicId } = req.clinic;

    const service = container.resolve(SoftPatientDeleteService);

    const result = await service.execute(clinicId, id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: result,
    });

    return next();
  }
}

export { PatientController };
