import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { ConstantsKeys } from "@common/ConstantsKeys";
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
      ConstantsKeys.MAX_DAYS_ON_GET_CALENDAR
    )
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorCalendarSearchIntervalTooLarge", [
          ConstantsKeys.MAX_DAYS_ON_GET_CALENDAR,
        ])
      );

    const [hasProfessional] = await transaction([
      this.professionalRepository.getBaseDuration(clinicId, professionalId),
    ]);

    if (!hasProfessional)
      throw new AppError(
        "NOT_FOUND",
        i18n.__mf("ErrorUserIDNotFound", ["profissional"])
      );

    const [appointments, scheduleLocks, weeklySchedule] = await transaction([
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
      this.scheduleRepository.getWeeklySchedule(professionalId),
    ]);

    const scheduleLocksConverted: (ScheduleLockOnCalendarModel | null)[] =
      scheduleLocks.map(
        (item: ScheduleLockModel): ScheduleLockOnCalendarModel | null => {
          const startTimeConverted = this.dateProvider.time2date(
            new Date(item.startTime).toISOString().split("T")[1].split(":00")[0]
          );
          const endTimeConverted = this.dateProvider.time2date(
            new Date(item.endTime).toISOString().split("T")[1].split(":00")[0]
          );

          const [_dayOfTheWeekSchedule] = weeklySchedule.filter(
            ({
              dayOfTheWeek,
            }: WeeklyScheduleModel & {
              WeeklyScheduleLocks: WeeklyScheduleLockModel[];
            }) =>
              dayOfTheWeek ===
                this.dateProvider.getWeekDay(
                  this.dateProvider.getUTCDate(
                    item.date.toISOString().split("T")[0],
                    "12:00"
                  )
                ) && dayOfTheWeek
          );

          if (_dayOfTheWeekSchedule) {
            const conflicting =
              _dayOfTheWeekSchedule.WeeklyScheduleLocks.filter(
                (_lock: WeeklyScheduleLockModel) => {
                  const _lockStartTimeConverted = this.dateProvider.time2date(
                    (_lock.startTime as Date)
                      .toISOString()
                      .split("T")[1]
                      .split(":00")[0]
                  );
                  const _lockEndTimeConverted = this.dateProvider.time2date(
                    (_lock.endTime as Date)
                      .toISOString()
                      .split("T")[1]
                      .split(":00")[0]
                  );

                  if (
                    this.dateProvider.intervalConflicting(
                      {
                        start: startTimeConverted,
                        end: endTimeConverted,
                      },
                      {
                        start: _lockStartTimeConverted,
                        end: _lockEndTimeConverted,
                      }
                    )
                  )
                    return _lock;

                  return null;
                }
              );

            const _return = (conflicting as WeeklyScheduleLockModel[]).reduce<{
              startTime: Date;
              endTime: Date;
            } | null>(
              (
                acc: { startTime: Date; endTime: Date } | null,
                _lock: WeeklyScheduleLockModel
              ): { startTime: Date; endTime: Date } | null => {
                if (
                  this.dateProvider.isAfter(
                    _lock.endTime as Date,
                    item.endTime as Date
                  ) &&
                  this.dateProvider.isBefore(
                    _lock.startTime as Date,
                    item.startTime as Date
                  )
                )
                  return null;

                if (
                  this.dateProvider.isBefore(
                    item.startTime as Date,
                    _lock.endTime as Date
                  ) &&
                  this.dateProvider.isAfter(
                    item.startTime as Date,
                    _lock.startTime as Date
                  )
                )
                  return {
                    endTime: acc?.endTime as Date,
                    startTime: _lock.endTime as Date,
                  };

                if (
                  this.dateProvider.isBefore(
                    item.endTime as Date,
                    _lock.endTime as Date
                  ) &&
                  this.dateProvider.isAfter(
                    item.endTime as Date,
                    _lock.startTime as Date
                  )
                )
                  return {
                    endTime: _lock.startTime as Date,
                    startTime: acc?.startTime as Date,
                  };

                return acc;
              },
              {
                startTime: item.startTime as Date,
                endTime: item.endTime as Date,
              }
            );

            if (!_return) return null;

            if (this.dateProvider.equals(_return.startTime, _return.endTime))
              return null;

            return {
              id: item.id,
              resource: "LOCK",
              date: this.maskProvider.date(item.date),
              endTime: this.maskProvider.time(_return.endTime),
              startTime: this.maskProvider.time(_return.startTime),
            };
          }

          return {
            id: item.id,
            resource: "LOCK",
            date: this.maskProvider.date(item.date),
            endTime: this.maskProvider.time(item.endTime as Date),
            startTime: this.maskProvider.time(item.startTime as Date),
          };
        }
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
        ? Array.from({ length: 7 })
            .fill({})
            .map((_, index: number): WeeklyScheduleOnCalendarModel => {
              const hasScheduleIndex = weeklySchedule.findIndex(
                ({ dayOfTheWeek }: WeeklyScheduleModel) =>
                  dayOfTheWeek === index + 1
              );

              if (
                hasScheduleIndex >= 0 &&
                hasScheduleIndex < weeklySchedule.length
              )
                return {
                  id: weeklySchedule[hasScheduleIndex].id,
                  endTime: this.maskProvider.time(
                    weeklySchedule[hasScheduleIndex].endTime as Date
                  ),
                  startTime: this.maskProvider.time(
                    weeklySchedule[hasScheduleIndex].startTime as Date
                  ),
                  dayOfTheWeek: weeklySchedule[hasScheduleIndex].dayOfTheWeek,
                  locks: weeklySchedule[
                    hasScheduleIndex
                  ].WeeklyScheduleLocks.map(
                    (
                      lock: WeeklyScheduleLockModel
                    ): WeeklyScheduleLockOnCalendarModel => ({
                      id: lock.id,
                      endTime: this.maskProvider.time(lock.endTime as Date),
                      startTime: this.maskProvider.time(lock.startTime as Date),
                      resource: "LOCK",
                    })
                  ),
                };

              return {
                dayOfTheWeek: index + 1,
              } as WeeklyScheduleOnCalendarModel;
            })
        : undefined,
      scheduleLocks: scheduleLocksConverted.filter(
        (item) => item !== null && item
      ) as ScheduleLockOnCalendarModel[],
    };
  }
}

export { GetCalendarService };
