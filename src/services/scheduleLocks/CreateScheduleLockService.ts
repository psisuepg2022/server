import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { getEnumDescription } from "@helpers/getEnumDescription";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { DaysOfTheWeek } from "@infra/domains";
import { CreateScheduleLockRequestModel } from "@models/dto/scheduleLock/CreateScheduleLockRequestModel";
import { CreateScheduleLockResponseModel } from "@models/dto/scheduleLock/CreateScheduleLockResponseModel";
import { IDateProvider } from "@providers/date";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IProfessionalRepository } from "@repositories/professional";
import { IScheduleRepository } from "@repositories/schedule";

@injectable()
class CreateScheduleLockService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ValidatorsProvider")
    private validatorsProvider: IValidatorsProvider,
    @inject("ProfessionalRepository")
    private professionalRepository: IProfessionalRepository,
    @inject("ScheduleRepository")
    private scheduleRepository: IScheduleRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  public async execute({
    date,
    clinicId,
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

    if (
      this.dateProvider.isBefore(
        this.dateProvider.getUTCDate(date, endTime),
        this.dateProvider.now()
      )
    )
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

    const endTimeConverted = this.dateProvider.time2date(endTime);
    const startTimeConverted = this.dateProvider.time2date(startTime);

    if (this.dateProvider.isAfter(startTimeConverted, endTimeConverted))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorScheduleLockIntervalInvalid")
      );

    const [hasProfessional] = await transaction([
      this.professionalRepository.getBaseDuration(clinicId, professionalId),
    ]);

    if (!hasProfessional)
      throw new AppError(
        "NOT_FOUND",
        i18n.__mf("ErrorUserIDNotFound", ["profissional"])
      );

    const dateConverted = this.dateProvider.getUTCDate(date);

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
        i18n.__("ErrorScheduleLockIntervalOutOfBaseDuration")
      );

    const [hasWeeklySchedule] = await transaction([
      this.scheduleRepository.hasWeeklyScheduleConflictingWithScheduleLock(
        professionalId,
        startTimeConverted,
        endTimeConverted,
        this.dateProvider.getWeekDay(dateConverted)
      ),
    ]);

    if (hasWeeklySchedule)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorScheduleLockHasWeeklyScheduleLock", [
          getEnumDescription(
            "DAYS_OF_THE_WEEK",
            DaysOfTheWeek[hasWeeklySchedule.dayOfTheWeek as number]
          ),
        ])
      );

    const [hasScheduleLock] = await transaction([
      this.scheduleRepository.hasConflictingScheduleLock(
        professionalId,
        startTimeConverted,
        endTimeConverted,
        dateConverted
      ),
    ]);

    if (hasScheduleLock)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorScheduleLockConflicting", [
          this.maskProvider.date(hasScheduleLock.date),
          this.maskProvider.time(hasScheduleLock.startTime as Date),
          this.maskProvider.time(hasScheduleLock.endTime as Date),
        ])
      );

    const [saved] = await transaction([
      this.scheduleRepository.saveLockItem(professionalId, {
        date: new Date(date),
        endTime: endTimeConverted,
        startTime: startTimeConverted,
        id: this.uniqueIdentifierProvider.generate(),
      }),
    ]);

    return {
      id: saved.id,
      date: this.maskProvider.date(saved.date),
      endTime: this.maskProvider.time(saved.endTime as Date),
      startTime: this.maskProvider.time(saved.startTime as Date),
    };
  }
}

export { CreateScheduleLockService };
