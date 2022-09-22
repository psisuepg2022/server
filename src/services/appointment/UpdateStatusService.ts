import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { getEnumDescription } from "@helpers/getEnumDescription";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { toNumber } from "@helpers/toNumber";
import { transaction } from "@infra/database/transaction";
import { AppointmentStatus } from "@infra/domains";
import { UpdateStatusRequestModel } from "@models/dto/appointment/UpdateStatusRequestModel";
import { AppointmentOnCalendarModel } from "@models/dto/calendar/AppointmentOnCalendarModel";
import { IDateProvider } from "@providers/date";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IAppointmentRepository } from "@repositories/appointment";

@injectable()
class UpdateStatusService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("AppointmentRepository")
    private appointmentRepository: IAppointmentRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  public async execute({
    id,
    status,
  }: UpdateStatusRequestModel): Promise<AppointmentOnCalendarModel | null> {
    if (stringIsNullOrEmpty(id))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUpdateStatusIdRequired"));

    if (!this.uniqueIdentifierProvider.isValid(id))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    if (stringIsNullOrEmpty(status))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorUpdateStatusStatusRequired")
      );

    const statusConverted = toNumber({
      value: status,
      error: new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorUpdateStatusDomainConvertionInvalid")
      ),
    });

    if (!(statusConverted in AppointmentStatus))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorValueOutOfAppointmentStatusDomain")
      );

    const [hasAppointment] = await transaction([
      this.appointmentRepository.findToUpdateStatus(id),
    ]);

    if (!hasAppointment)
      throw new AppError(
        "NOT_FOUND",
        i18n.__("ErrorUpdateStatusAppointmentNotFound")
      );

    if (hasAppointment.status === statusConverted)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorUpdateStatusAlreadyUpdated")
      );

    if (
      [
        AppointmentStatus.ABSENCE,
        AppointmentStatus.CANCELED,
        AppointmentStatus.COMPLETED,
      ].includes(hasAppointment.status)
    )
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUpdateStatusAppointmentFinished", [
          getEnumDescription(
            "APPOINTMENT_STATUS",
            AppointmentStatus[hasAppointment.status]
          ),
        ])
      );

    if (
      hasAppointment.status === AppointmentStatus.CONFIRMED &&
      statusConverted === AppointmentStatus.SCHEDULED
    )
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUpdateStatusInvalidChange", [
          getEnumDescription(
            "APPOINTMENT_STATUS",
            AppointmentStatus[AppointmentStatus.CONFIRMED]
          ),
          getEnumDescription(
            "APPOINTMENT_STATUS",
            AppointmentStatus[AppointmentStatus.SCHEDULED]
          ),
        ])
      );

    const now = this.dateProvider.now();

    if (
      this.dateProvider.isBefore(hasAppointment.appointmentDate, now) &&
      ![AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED].includes(
        hasAppointment.status
      )
    )
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorUpdateStatusAppointmentDatePast")
      );

    if (
      (statusConverted === AppointmentStatus.CANCELED ||
        statusConverted === AppointmentStatus.ABSENCE) &&
      this.dateProvider.isAfter(hasAppointment.appointmentDate, now)
    ) {
      await transaction([this.appointmentRepository.deleteById(id)]);
      return null;
    }

    const [updated] = await transaction([
      this.appointmentRepository.updateStatus(id, statusConverted, now),
    ]);

    return {
      id: updated.id || "",
      endDate: this.dateProvider
        .addMinutes(
          updated.appointmentDate as Date,
          hasAppointment.professional.baseDuration
        )
        .toISOString(),
      resource: getEnumDescription(
        "APPOINTMENT_STATUS",
        AppointmentStatus[updated.status || -1]
      ),
      startDate: updated.appointmentDate?.toISOString() || "",
      title: updated.patient.person.name || "",
      updatedAt: updated.updatedAt?.toISOString() || "",
    };
  }
}

export { UpdateStatusService };
