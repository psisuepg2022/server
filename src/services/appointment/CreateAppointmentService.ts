import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { time2date } from "@helpers/time2date";
import { transaction } from "@infra/database/transaction";
import { CreateAppointmentRequestModel } from "@models/dto/appointment/CreateAppointmentRequestModel";
import { CreateAppointmentResponseModel } from "@models/dto/appointment/CreateAppointmentResponseModel";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IPersonRepository } from "@repositories/person";
import { IProfessionalRepository } from "@repositories/professional";

@injectable()
class CreateAppointmentService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ValidatorsProvider")
    private validatorsProvider: IValidatorsProvider,
    @inject("ProfessionalRepository")
    private professionalRepository: IProfessionalRepository,
    @inject("PersonRepository")
    private personRepository: IPersonRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider
  ) {}

  public async execute({
    professionalId,
    patientId,
    employeeId,
    date,
    endTime,
    startTime,
    clinicId,
  }: CreateAppointmentRequestModel): Promise<CreateAppointmentResponseModel> {
    if (stringIsNullOrEmpty(professionalId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["profissional"])
      );

    if (stringIsNullOrEmpty(patientId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["paciente"])
      );

    if (stringIsNullOrEmpty(employeeId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["colaborador"])
      );

    if (
      !this.uniqueIdentifierProvider.isValid(professionalId) ||
      !this.uniqueIdentifierProvider.isValid(patientId) ||
      !this.uniqueIdentifierProvider.isValid(employeeId)
    )
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    if (stringIsNullOrEmpty(date))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorAppointmentDateRequired")
      );

    if (!this.validatorsProvider.date(date))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorAppointmentDateInvalid"));

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (new Date(date).getTime() < today.getTime())
      throw new AppError("BAD_REQUEST", i18n.__("ErrorAppointmentPastDate"));

    if (stringIsNullOrEmpty(startTime))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorAppointmentStartTimeRequired")
      );

    if (!this.validatorsProvider.time(startTime))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorAppointmentStartTimeInvalid")
      );

    if (stringIsNullOrEmpty(endTime))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorAppointmentEndTimeRequired")
      );

    if (!this.validatorsProvider.time(endTime))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorAppointmentEndTimeInvalid")
      );

    const dateConverted = new Date(date);
    const endTimeConverted = time2date(endTime);
    const startTimeConverted = time2date(startTime);
    const totalTimeInMs =
      endTimeConverted.getTime() - startTimeConverted.getTime();

    if (startTimeConverted > endTimeConverted)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorAppointmentIntervalInvalid")
      );

    const [hasPatient] = await transaction([
      this.personRepository.findActivated(
        clinicId,
        patientId,
        UserDomainClasses.PATIENT
      ),
    ]);

    if (!hasPatient)
      throw new AppError(
        "NOT_FOUND",
        i18n.__mf("ErrorUserIDNotFound", ["paciente"])
      );

    const [hasProfessional] = await transaction([
      this.professionalRepository.getBaseDuration(clinicId, professionalId),
    ]);

    if (!hasProfessional)
      throw new AppError(
        "NOT_FOUND",
        i18n.__mf("ErrorUserIDNotFound", ["profissional"])
      );

    if (totalTimeInMs % (hasProfessional.baseDuration * 60000))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorAppointmentIntervalOutOfBaseDuration")
      );

    return {} as CreateAppointmentResponseModel;
  }
}

export { CreateAppointmentService };
