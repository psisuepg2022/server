import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { getEnumDescription } from "@helpers/getEnumDescription";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { toNumber } from "@helpers/toNumber";
import { transaction } from "@infra/database/transaction";
import { DaysOfTheWeek } from "@infra/domains";
import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";
import { WeeklyScheduleModel } from "@models/domain/WeeklyScheduleModel";
import { CreateWeeklyScheduleLockRequestModel } from "@models/dto/weeklySchedule/CreateWeeklyScheduleLockRequestModel";
import { SaveWeeklyScheduleRequestModel } from "@models/dto/weeklySchedule/SaveWeeklyScheduleRequestModel";
import { SaveWeeklyScheduleResponseModel } from "@models/dto/weeklySchedule/SaveWeeklyScheduleResponseModel";
import { PrismaPromise } from "@prisma/client";
import { IDateProvider } from "@providers/date";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IAppointmentRepository } from "@repositories/appointment";
import { IProfessionalRepository } from "@repositories/professional";
import { IScheduleRepository } from "@repositories/schedule";

@injectable()
class SaveWeeklyScheduleService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ValidatorsProvider")
    private validatorsProvider: IValidatorsProvider,
    @inject("ScheduleRepository")
    private scheduleRepository: IScheduleRepository,
    @inject("ProfessionalRepository")
    private professionalRepository: IProfessionalRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("AppointmentRepository")
    private appointmentRepository: IAppointmentRepository
  ) {}

  private validateInterval = (start: string, end: string, index = -1): void => {
    this.validateTime("Start", start, index);
    this.validateTime("End", end, index);

    if (this.dateProvider.time2date(start) > this.dateProvider.time2date(end))
      throw new AppError(
        "BAD_REQUEST",
        index === -1
          ? i18n.__("ErrorWeeklyScheduleInvalidInterval")
          : i18n.__mf("ErrorWeeklyScheduleLockInvalidInterval", [index + 1])
      );
  };

  private validateTime = (
    label: "Start" | "End",
    time: string,
    index: number
  ): void => {
    if (stringIsNullOrEmpty(time))
      throw new AppError(
        "BAD_REQUEST",
        index === -1
          ? i18n.__(`ErrorWeeklySchedule${label}TimeRequired`)
          : i18n.__mf(`ErrorWeeklyScheduleLock${label}TimeRequired`, [
              index + 1,
            ])
      );

    if (!this.validatorsProvider.time(time))
      throw new AppError(
        "BAD_REQUEST",
        index === -1
          ? i18n.__(`ErrorWeeklySchedule${label}TimeInvalid`)
          : i18n.__mf(`ErrorWeeklyScheduleLock${label}TimeInvalid`, [index + 1])
      );
  };

  protected getObjectId = (id?: string): string =>
    id && !stringIsNullOrEmpty(id) && this.uniqueIdentifierProvider.isValid(id)
      ? id
      : this.uniqueIdentifierProvider.generate();

  public async execute({
    id: idReceived,
    professionalId,
    endTime,
    startTime,
    locks,
    clinicId,
    dayOfTheWeek,
  }: SaveWeeklyScheduleRequestModel): Promise<SaveWeeklyScheduleResponseModel> {
    const id = this.getObjectId(idReceived);

    if (stringIsNullOrEmpty(professionalId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorProfessionalRequired"));

    if (!this.uniqueIdentifierProvider.isValid(professionalId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    this.validateInterval(startTime, endTime);

    if (stringIsNullOrEmpty(dayOfTheWeek))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorWeekScheduleDayOfTheWeekRequired")
      );

    const dayOfTheWeekConverted = toNumber({
      value: dayOfTheWeek,
      error: new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorWeekScheduleDayOfTheWeekInvalid")
      ),
    });

    if (!(dayOfTheWeekConverted in DaysOfTheWeek))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorWeekScheduleDayOfTheWeekInvalid")
      );

    const [hasProfessional] = await transaction([
      this.professionalRepository.getBaseDuration(clinicId, professionalId),
    ]);

    if (!hasProfessional)
      throw new AppError(
        "NOT_FOUND",
        i18n.__mf("ErrorUserIDNotFound", ["profissional"])
      );

    const startTimeConverted = this.dateProvider.time2date(startTime);
    const endTimeConverted = this.dateProvider.time2date(endTime);

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
        i18n.__mf("ErrorWeeklyScheduleIntervalOutOfBaseDuration", [
          hasProfessional.baseDuration,
        ])
      );

    const [hasDayOfTheWeekDuplicated] = await transaction([
      this.scheduleRepository.hasDayOfTheWeekDuplicated(
        id,
        professionalId,
        dayOfTheWeekConverted
      ),
    ]);

    if (hasDayOfTheWeekDuplicated)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorWeeklyScheduleDayOfTheWeekDuplicated")
      );

    if (idReceived) {
      const [hasSchedule] = await transaction([
        this.scheduleRepository.hasWeeklySchedule(id, professionalId),
      ]);

      if (!hasSchedule)
        throw new AppError("NOT_FOUND", i18n.__("ErrorWeeklyScheduleNotFound"));
    }

    const [hasFutureAppointments] = await transaction([
      this.appointmentRepository.hasUncompletedAppointmentsByDayOfTheWeek(
        professionalId,
        dayOfTheWeekConverted,
        this.dateProvider.now(),
        startTimeConverted,
        endTimeConverted
      ),
    ]);

    if (hasFutureAppointments.length > 0)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorWeeklyScheduleUncompletedAppointments", [
          getEnumDescription(
            "DAYS_OF_THE_WEEK",
            DaysOfTheWeek[dayOfTheWeekConverted]
          ),
        ])
      );

    const createLocksOperations: PrismaPromise<WeeklyScheduleLockModel>[] = [];

    if (locks && Array.isArray(locks) && locks.length > 0)
      await Promise.all(
        locks.map(
          async (
            item: CreateWeeklyScheduleLockRequestModel,
            index: number
          ): Promise<void> => {
            this.validateInterval(item.startTime, item.endTime, index);

            const startDate = this.dateProvider.time2date(item.startTime);
            const endDate = this.dateProvider.time2date(item.endTime);

            if (
              (this.dateProvider.differenceInMillis(endDate, startDate) /
                this.dateProvider.minuteToMilli(hasProfessional.baseDuration)) %
              2
            )
              throw new AppError(
                "BAD_REQUEST",
                i18n.__("ErrorWeeklyScheduleLockIntervalOutOfBaseDuration")
              );

            const [hasLock] = await transaction([
              this.scheduleRepository.hasConflictingWeeklyScheduleLock(
                id,
                startDate,
                endDate
              ),
            ]);

            if (hasLock)
              throw new AppError(
                "BAD_REQUEST",
                i18n.__mf("ErrorWeeklyScheduleLockConflicting", [
                  index + 1,
                  getEnumDescription(
                    "DAYS_OF_THE_WEEK",
                    DaysOfTheWeek[hasLock.weeklySchedule.dayOfTheWeek as number]
                  ),
                  this.maskProvider.time(new Date(hasLock.startTime)),
                  this.maskProvider.time(new Date(hasLock.endTime)),
                ])
              );

            createLocksOperations.push(
              this.scheduleRepository.saveWeeklyScheduleLockItem(id, {
                endTime: endDate,
                startTime: startDate,
                id: this.uniqueIdentifierProvider.generate(),
              })
            );
          }
        )
      );

    const [weeklyScheduleUpdated, ...insertedLocks] = await transaction([
      this.scheduleRepository.saveWeeklyScheduleItem(professionalId, {
        id,
        endTime: endTimeConverted,
        startTime: startTimeConverted,
        dayOfTheWeek: dayOfTheWeekConverted,
      } as WeeklyScheduleModel),
      ...createLocksOperations,
    ]);

    return {
      id: weeklyScheduleUpdated.id,
      endTime: this.maskProvider.time(new Date(weeklyScheduleUpdated.endTime)),
      startTime: this.maskProvider.time(
        new Date(weeklyScheduleUpdated.startTime)
      ),
      dayOfTheWeek: getEnumDescription(
        "DAYS_OF_THE_WEEK",
        DaysOfTheWeek[dayOfTheWeekConverted]
      ),
      locks: insertedLocks.map(
        (item: WeeklyScheduleLockModel): WeeklyScheduleLockModel => ({
          id: item.id,
          endTime: this.maskProvider.time(new Date(item.endTime)),
          startTime: this.maskProvider.time(new Date(item.startTime)),
        })
      ),
    };
  }
}

export { SaveWeeklyScheduleService };
