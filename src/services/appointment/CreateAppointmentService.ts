import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { AppError } from "@handlers/error/AppError";
import { getEnumDescription } from "@helpers/getEnumDescription";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { AppointmentStatus } from "@infra/domains";
import { AppointmentModel } from "@models/domain/AppointmentModel";
import { CreateAppointmentRequestModel } from "@models/dto/appointment/CreateAppointmentRequestModel";
import { CreateAppointmentResponseModel } from "@models/dto/appointment/CreateAppointmentResponseModel";
import { IDateProvider } from "@providers/date";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IAppointmentRepository } from "@repositories/appointment";
import { IPersonRepository } from "@repositories/person";
import { IProfessionalRepository } from "@repositories/professional";
import { IScheduleRepository } from "@repositories/schedule";

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
    private maskProvider: IMaskProvider,
    @inject("ScheduleRepository")
    private scheduleRepository: IScheduleRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("AppointmentRepository")
    private appointmentRepository: IAppointmentRepository
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

    if (
      this.dateProvider.isBefore(
        this.dateProvider.getUTCDate(date, startTime),
        this.dateProvider.now()
      )
    )
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

    const endTimeConverted = this.dateProvider.time2date(endTime);
    const startTimeConverted = this.dateProvider.time2date(startTime);

    if (this.dateProvider.isAfter(startTimeConverted, endTimeConverted))
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

    if (
      (this.dateProvider.differenceInMillis(
        endTimeConverted,
        startTimeConverted
      ) /
        this.dateProvider.minuteToMilli(hasProfessional.baseDuration)) %
      2
    )
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorAppointmentIntervalOutOfBaseDuration")
      );

    const [appointmentDate, forecastEndAppointmentDate] = [
      this.dateProvider.time2date(startTime, date),
      this.dateProvider.time2date(endTime, date),
    ];

    const [hasAppointment] = await transaction([
      this.appointmentRepository.hasAppointmentByStatus(
        professionalId,
        appointmentDate,
        forecastEndAppointmentDate,
        [AppointmentStatus.COMPLETED, AppointmentStatus.SCHEDULED]
      ),
    ]);

    if (hasAppointment)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorAppointmentAlreadyExists", [
          hasAppointment.patient.person.name,
        ])
      );

    const [hasTimeWithoutLock] = await transaction([
      this.scheduleRepository.hasTimeWithoutLock(
        professionalId,
        this.dateProvider.getWeekDay(appointmentDate),
        startTimeConverted,
        endTimeConverted
      ),
    ]);

    if (!hasTimeWithoutLock)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorAppointmentDontHaveTimeWithoutLock")
      );

    const [hasLock] = await transaction([
      this.scheduleRepository.hasConflictingScheduleLock(
        professionalId,
        startTimeConverted,
        endTimeConverted,
        appointmentDate
      ),
    ]);

    if (hasLock)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorAppointmentDateWithScheduleLock", [
          this.maskProvider.date(hasLock.date),
          this.maskProvider.time(hasLock.startTime as Date),
          this.maskProvider.time(hasLock.endTime as Date),
        ])
      );

    const [saved] = await transaction([
      this.appointmentRepository.saveAppointment(
        professionalId,
        employeeId,
        patientId,
        {
          appointmentDate,
          id: this.uniqueIdentifierProvider.generate(),
          status: AppointmentStatus.SCHEDULED,
          updatedAt: this.dateProvider.now(),
        } as AppointmentModel
      ),
    ]);

    return {
      id: saved.id,
      date: this.maskProvider.date(saved.appointmentDate),
      status: getEnumDescription(
        "APPOINTMENT_STATUS",
        AppointmentStatus[saved.status]
      ),
      endTime,
      startTime,
      updatedAt: saved.updatedAt.toISOString(),
    };
  }
}

export { CreateAppointmentService };
