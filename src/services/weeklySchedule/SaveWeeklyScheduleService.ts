import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { getEnumDescription } from "@helpers/getEnumDescription";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { time2date } from "@helpers/time2date";
import { toNumber } from "@helpers/toNumber";
import { transaction } from "@infra/database/transaction";
import { DaysOfTheWeek } from "@infra/domains";
import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";
import { WeeklyScheduleModel } from "@models/domain/WeeklyScheduleModel";
import { CreateWeeklyScheduleLockRequestModel } from "@models/dto/weeklySchedule/CreateWeeklyScheduleLockRequestModel";
import { SaveWeeklyScheduleRequestModel } from "@models/dto/weeklySchedule/SaveWeeklyScheduleRequestModel";
import { SaveWeeklyScheduleResponseModel } from "@models/dto/weeklySchedule/SaveWeeklyScheduleResponseModel";
import { PrismaPromise } from "@prisma/client";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
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
    private maskProvider: IMaskProvider
  ) {}

  private validateInterval = (start: string, end: string, index = -1): void => {
    if (time2date(start) > time2date(end))
      throw new AppError(
        "BAD_REQUEST",
        index === -1
          ? i18n.__("ErrorWeeklyScheduleInvalidInterval")
          : i18n.__mf("ErrorWeeklyScheduleLockInvalidInterval", [index + 1])
      );

    this.validateTime("Start", start, index);
    this.validateTime("End", end, index);
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

  public async execute({
    id,
    professionalId,
    endTime,
    startTime,
    baseDuration,
    locks,
  }: SaveWeeklyScheduleRequestModel): Promise<SaveWeeklyScheduleResponseModel> {
    if (stringIsNullOrEmpty(id))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorWeeklyScheduleIDRequired")
      );

    if (stringIsNullOrEmpty(professionalId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorProfessionalRequired"));

    if (
      !this.uniqueIdentifierProvider.isValid(id) ||
      !this.uniqueIdentifierProvider.isValid(professionalId)
    )
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    if (stringIsNullOrEmpty(baseDuration))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorBaseDurationRequired"));

    const baseDurationConverted = toNumber({
      value: baseDuration,
      error: new AppError("BAD_REQUEST", i18n.__("ErrorBaseDurationInvalid")),
    });

    this.validateInterval(startTime, endTime);

    const [hasSchedule] = await transaction([
      this.scheduleRepository.hasWeeklySchedule(id, professionalId),
    ]);

    if (!hasSchedule)
      throw new AppError("NOT_FOUND", i18n.__("ErrorWeeklyScheduleNotFound"));

    const createLocksOperations: PrismaPromise<WeeklyScheduleLockModel>[] = [];

    if (locks && Array.isArray(locks) && locks.length > 0)
      await Promise.all(
        locks.map(
          async (
            item: CreateWeeklyScheduleLockRequestModel,
            index: number
          ): Promise<void> => {
            this.validateInterval(item.startTime, item.endTime, index);

            // validar base duration

            const [hasLock] = await transaction([
              this.scheduleRepository.hasConflictingLock(
                id,
                time2date(item.startTime),
                time2date(item.endTime)
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
                endTime: time2date(item.endTime),
                startTime: time2date(item.startTime),
                id: this.uniqueIdentifierProvider.generate(),
              })
            );
          }
        )
      );

    const [weeklyScheduleUpdated, professionalUpdated, ...insertedLocks] =
      await transaction([
        this.scheduleRepository.updateSchedule({
          id,
          endTime: time2date(endTime),
          startTime: time2date(startTime),
        } as WeeklyScheduleModel),
        this.professionalRepository.updateBaseDuration(
          professionalId,
          baseDurationConverted
        ),
        ...createLocksOperations,
      ]);

    return {
      baseDuration: professionalUpdated.baseDuration || -1,
      id: weeklyScheduleUpdated.id,
      endTime: this.maskProvider.time(new Date(weeklyScheduleUpdated.endTime)),
      startTime: this.maskProvider.time(
        new Date(weeklyScheduleUpdated.startTime)
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
