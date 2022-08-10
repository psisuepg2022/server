import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { time2date } from "@helpers/time2date";
import { CreateScheduleLockRequestModel } from "@models/dto/scheduleLock/CreateScheduleLockRequestModel";
import { CreateScheduleLockResponseModel } from "@models/dto/scheduleLock/CreateScheduleLockResponseModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";

@injectable()
class CreateScheduleLockService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ValidatorsProvider")
    private validatorsProvider: IValidatorsProvider
  ) {}

  public async execute({
    date,
    endTime,
    professionalId,
    startTime,
  }: CreateScheduleLockRequestModel): Promise<CreateScheduleLockResponseModel> {
    if (stringIsNullOrEmpty(professionalId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["profissional"])
      );

    if (!this.uniqueIdentifierProvider.isValid(professionalId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    if (stringIsNullOrEmpty(date))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorScheduleLockDateRequired")
      );

    if (!this.validatorsProvider.date(date))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorScheduleLockDateInvalid")
      );

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (new Date(date).getTime() < today.getTime())
      throw new AppError("BAD_REQUEST", i18n.__("ErrorScheduleLockPastDate"));

    if (stringIsNullOrEmpty(startTime))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorScheduleLockStartTimeRequired")
      );

    if (!this.validatorsProvider.time(startTime))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorScheduleLockStartTimeInvalid")
      );

    if (stringIsNullOrEmpty(endTime))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorScheduleLockEndTimeRequired")
      );

    if (!this.validatorsProvider.time(endTime))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorScheduleLockEndTimeInvalid")
      );

    if (time2date(startTime) > time2date(endTime))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorScheduleLockIntervalInvalid")
      );

    return {} as CreateScheduleLockResponseModel;
  }
}

export { CreateScheduleLockService };
