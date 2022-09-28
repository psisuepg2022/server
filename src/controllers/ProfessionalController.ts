import { NextFunction, Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { ListPatientsResponseModel } from "@models/dto/patient/ListPatientsResponseModel";
import { GetProfessionalProfileResponseModel } from "@models/dto/professional/GetProfessionalProfileResponseModel";
import { GetProfessionalsToScheduleTapBarResponseModel } from "@models/dto/professional/GetProfessionalsToScheduleTapBarResponseModel";
import { ListProfessionalsResponseModel } from "@models/dto/professional/ListProfessionalsResponseModel";
import { SoftProfessionalDeleteResponseModel } from "@models/dto/professional/SoftProfessionalDeleteResponseModel";
import {
  ConfigureProfessionalService,
  CreateProfessionalService,
  GetProfessionalProfileService,
  GetProfessionalsToScheduleTopBarService,
  SearchProfessionalPatientsWithFiltersService,
  SearchProfessionalsWithFiltersService,
  SoftProfessionalDeleteService,
  UpdateProfessionalService,
} from "@services/professional";

class ProfessionalController {
  public async create(
    req: Request,
    res: Response<IResponseMessage<Partial<ProfessionalModel>>>,
    next: NextFunction
  ): Promise<void> {
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

    res.status(httpStatusResponse).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async updateProfile(
    req: Request,
    res: Response<IResponseMessage<Partial<ProfessionalModel>>>,
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
      profession,
      registry,
      specialization,
    } = req.body;

    const { id: userId } = req.user;
    const { id: clinicId } = req.clinic;

    const service = container.resolve(UpdateProfessionalService);

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
      IResponseMessage<IPaginationResponse<ListProfessionalsResponseModel>>
    >,
    next: NextFunction
  ): Promise<void> {
    const { page, size } = req.query;
    const { id: clinicId } = req.clinic;

    const { name, CPF, email } = req.body;

    const service = container.resolve(SearchProfessionalsWithFiltersService);

    const result = await service.execute(clinicId, {
      page,
      size,
      filters: {
        name,
        CPF,
        email,
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
    res: Response<IResponseMessage<SoftProfessionalDeleteResponseModel>>,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const { id: clinicId } = req.clinic;

    const softDeleteService = container.resolve(SoftProfessionalDeleteService);

    const result = await softDeleteService.execute(clinicId, id);

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async getProfile(
    req: Request,
    res: Response<IResponseMessage<GetProfessionalProfileResponseModel>>,
    next: NextFunction
  ): Promise<void> {
    const { id: userId } = req.user;
    const { id: clinicId } = req.clinic;

    const service = container.resolve(GetProfessionalProfileService);

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

  public async getProfessionalsToScheduleTopBar(
    req: Request,
    res: Response<
      IResponseMessage<
        IPaginationResponse<GetProfessionalsToScheduleTapBarResponseModel>
      >
    >,
    next: NextFunction
  ): Promise<void> {
    const { id: clinicId } = req.clinic;
    const { page, size } = req.query;

    const service = container.resolve(GetProfessionalsToScheduleTopBarService);

    const result = await service.execute(clinicId, {
      page,
      size,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async configure(
    req: Request,
    res: Response<IResponseMessage>,
    next: NextFunction
  ): Promise<void> {
    const { id: userId } = req.user;
    const { id: clinicId } = req.clinic;
    const {
      oldPassword,
      newPassword,
      confirmNewPassword,
      baseDuration,
      weeklySchedule,
    } = req.body;

    const service = container.resolve(ConfigureProfessionalService);

    await service.execute({
      clinicId,
      userId,
      oldPassword,
      newPassword,
      confirmNewPassword,
      baseDuration,
      weeklySchedule,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }

  public async myPatients(
    req: Request,
    res: Response<
      IResponseMessage<IPaginationResponse<ListPatientsResponseModel>>
    >,
    next: NextFunction
  ): Promise<void> {
    const { page, size } = req.query;
    const { id: clinicId } = req.clinic;
    const { id: professionalId } = req.user;

    const { name, CPF, email } = req.body;

    const service = container.resolve(
      SearchProfessionalPatientsWithFiltersService
    );

    const result = await service.execute(clinicId, {
      page,
      size,
      filters: {
        CPF,
        email,
        name,
        professionalId,
      },
    });

    res.status(HttpStatus.OK).json({
      success: true,
      content: result,
      message: i18n.__("SuccessGeneric"),
    });

    return next();
  }
}

export { ProfessionalController };
