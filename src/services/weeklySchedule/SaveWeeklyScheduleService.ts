import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { toNumber } from "@helpers/toNumber";
import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";
import { CreateWeeklyScheduleLockRequestModel } from "@models/dto/weeklySchedule/CreateWeeklyScheduleLockRequestModel";
import { SaveWeeklyScheduleRequestModel } from "@models/dto/weeklySchedule/SaveWeeklyScheduleRequestModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";

@injectable()
class SaveWeeklyScheduleService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ValidatorsProvider")
    private validatorsProvider: IValidatorsProvider
  ) {}

  public async execute({
    id,
    endTime,
    startTime,
    baseDuration,
    locks,
  }: SaveWeeklyScheduleRequestModel): Promise<any> {
    if (stringIsNullOrEmpty(id))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorWeeklyScheduleIDRequired")
      );

    if (!this.uniqueIdentifierProvider.isValid(id))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    if (stringIsNullOrEmpty(baseDuration))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorBaseDurationRequired"));

    const baseDurationConverted = toNumber({
      value: baseDuration,
      error: new AppError("BAD_REQUEST", i18n.__("ErrorBaseDurationInvalid")),
    });

    if (stringIsNullOrEmpty(startTime))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorWeeklyScheduleStartTimeRequired")
      );

    if (!this.validatorsProvider.time(startTime))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorWeeklyScheduleStartTimeInvalid")
      );

    if (stringIsNullOrEmpty(endTime))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorWeeklyScheduleEndTimeRequired")
      );

    if (!this.validatorsProvider.time(endTime))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorWeeklyScheduleEndTimeInvalid")
      );

    if (locks && Array.isArray(locks) && locks.length > 0)
      locks.map(
        (
          item: CreateWeeklyScheduleLockRequestModel,
          index: number
        ): WeeklyScheduleLockModel => {
          if (stringIsNullOrEmpty(item.startTime))
            throw new AppError(
              "BAD_REQUEST",
              i18n.__mf("ErrorWeeklyScheduleLockStartTimeRequired", [index + 1])
            );

          if (!this.validatorsProvider.time(item.startTime))
            throw new AppError(
              "BAD_REQUEST",
              i18n.__mf("ErrorWeeklyScheduleLockStartTimeInvalid", [index + 1])
            );

          if (stringIsNullOrEmpty(item.endTime))
            throw new AppError(
              "BAD_REQUEST",
              i18n.__mf("ErrorWeeklyScheduleLockEndTimeRequired", [index + 1])
            );

          if (!this.validatorsProvider.time(item.endTime))
            throw new AppError(
              "BAD_REQUEST",
              i18n.__mf("ErrorWeeklyScheduleLockEndTimeInvalid", [index + 1])
            );

          return {
            endTime: item.endTime,
            startTime: item.startTime,
            id: this.uniqueIdentifierProvider.generate(),
          };
        }
      );

    return {};
  }
}

export { SaveWeeklyScheduleService };
