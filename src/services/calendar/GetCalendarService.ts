import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { getEnumDescription } from "@helpers/getEnumDescription";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { AppointmentStatus } from "@infra/domains";
import { AppointmentModel } from "@models/domain/AppointmentModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ScheduleLockModel } from "@models/domain/ScheduleLockModel";
import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";
import { WeeklyScheduleModel } from "@models/domain/WeeklyScheduleModel";
import { AppointmentOnCalendarModel } from "@models/dto/calendar/AppointmentOnCalendarModel";
import { GetCalendarRequestModel } from "@models/dto/calendar/GetCalendarRequestModel";
import { GetCalendarResponseModel } from "@models/dto/calendar/GetCalendarResponseModel";
import { ScheduleLockOnCalendarModel } from "@models/dto/calendar/ScheduleLockOnCalendarModel";
import { WeeklyScheduleLockOnCalendarModel } from "@models/dto/calendar/WeeklyScheduleLockOnCalendarModel";
import { WeeklyScheduleOnCalendarModel } from "@models/dto/calendar/WeeklyScheduleOnCalendarModel";
import { PrismaPromise } from "@prisma/client";
import { IDateProvider } from "@providers/date";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IAppointmentRepository } from "@repositories/appointment";
import { IProfessionalRepository } from "@repositories/professional";
import { IScheduleRepository } from "@repositories/schedule";

@injectable()
class GetCalendarService {
  constructor(
    @inject("ValidatorsProvider")
    private validatorsProvider: IValidatorsProvider,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ProfessionalRepository")
    private professionalRepository: IProfessionalRepository,
    @inject("AppointmentRepository")
    private appointmentRepository: IAppointmentRepository,
    @inject("ScheduleRepository")
    private scheduleRepository: IScheduleRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider
  ) {}

  public async execute({
    endDate,
    startDate,
    professionalId,
    clinicId,
    returnWeeklySchedule,
  }: GetCalendarRequestModel): Promise<GetCalendarResponseModel> {
    if (stringIsNullOrEmpty(professionalId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["profissional"])
      );

    if (!this.uniqueIdentifierProvider.isValid(professionalId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const [startWeek, endWeek] = this.dateProvider.getCurrentWeek();

    const startDateConverted = ((): Date => {
      if (stringIsNullOrEmpty(startDate)) return startWeek;

      if (!this.validatorsProvider.date(startDate || ""))
        throw new AppError(
          "BAD_REQUEST",
          i18n.__("ErrorCalendarStarDateInvalid")
        );

      return this.dateProvider.getUTCDate(startDate as string);
    })();

    const endDateConverted = ((): Date => {
      if (stringIsNullOrEmpty(endDate)) return endWeek;

      if (!this.validatorsProvider.date(endDate || ""))
        throw new AppError(
          "BAD_REQUEST",
          i18n.__("ErrorCalendarEndDateInvalid")
        );

      return this.dateProvider.getUTCDate(endDate as string, "23:59");
    })();

    if (this.dateProvider.isAfter(startDateConverted, endDateConverted))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorCalendarIntervalInvalid")
      );

    if (
      this.dateProvider.differenceInDays(endDateConverted, startDateConverted) >
      30
    )
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorCalendarSearchIntervalTooLarge", ["30"])
      );

    const [hasProfessional] = await transaction([
      this.professionalRepository.getBaseDuration(clinicId, professionalId),
    ]);

    if (!hasProfessional)
      throw new AppError(
        "NOT_FOUND",
        i18n.__mf("ErrorUserIDNotFound", ["profissional"])
      );

    const [appointments, scheduleLocks, weeklySchedule] = await transaction(
      ((): PrismaPromise<any>[] => {
        const list: PrismaPromise<any>[] = [
          this.appointmentRepository.get(
            professionalId,
            startDateConverted,
            endDateConverted
          ),
          this.scheduleRepository.getScheduleLockByInterval(
            professionalId,
            startDateConverted,
            endDateConverted
          ),
        ];

        if (returnWeeklySchedule)
          list.push(this.scheduleRepository.getWeeklySchedule(professionalId));

        return list;
      })()
    );

    return {
      appointments: appointments.map(
        (
          item: Partial<AppointmentModel> & {
            patient: { person: Partial<PersonModel> };
          }
        ): AppointmentOnCalendarModel => ({
          id: item.id || "",
          endDate: this.dateProvider
            .addMinutes(
              item.appointmentDate as Date,
              hasProfessional.baseDuration
            )
            .toISOString(),
          resource: getEnumDescription(
            "APPOINTMENT_STATUS",
            AppointmentStatus[item.status || -1]
          ),
          startDate: item.appointmentDate?.toISOString() || "",
          title: item.patient.person.name || "",
          updatedAt: item.updatedAt?.toISOString() || "",
        })
      ),
      weeklySchedule: returnWeeklySchedule
        ? weeklySchedule.map(
            ({
              WeeklyScheduleLocks: locks,
              ...item
            }: WeeklyScheduleModel & {
              WeeklyScheduleLocks: WeeklyScheduleLockModel[];
            }): WeeklyScheduleOnCalendarModel => ({
              id: item.id,
              endTime: this.maskProvider.time(item.endTime as Date),
              startTime: this.maskProvider.time(item.startTime as Date),
              dayOfTheWeek: item.dayOfTheWeek,
              locks: locks.map(
                (
                  lock: WeeklyScheduleLockModel
                ): WeeklyScheduleLockOnCalendarModel => ({
                  id: lock.id,
                  endTime: this.maskProvider.time(lock.endTime as Date),
                  startTime: this.maskProvider.time(lock.startTime as Date),
                  resource: "LOCK",
                })
              ),
            })
          )
        : undefined,
      scheduleLocks: scheduleLocks.map(
        (item: ScheduleLockModel): ScheduleLockOnCalendarModel => ({
          date: this.maskProvider.date(item.date),
          endTime: this.maskProvider.time(item.endTime as Date),
          id: item.id,
          startTime: this.maskProvider.time(item.startTime as Date),
          resource: "LOCK",
        })
      ),
    };
  }
}

export { GetCalendarService };
