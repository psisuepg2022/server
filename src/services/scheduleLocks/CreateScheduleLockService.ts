import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { time2date } from "@helpers/time2date";
import { transaction } from "@infra/database/transaction";
import { CreateScheduleLockRequestModel } from "@models/dto/scheduleLock/CreateScheduleLockRequestModel";
import { CreateScheduleLockResponseModel } from "@models/dto/scheduleLock/CreateScheduleLockResponseModel";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IPersonRepository } from "@repositories/person";
import { IScheduleRepository } from "@repositories/schedule";

@injectable()
class CreateScheduleLockService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ValidatorsProvider")
    private validatorsProvider: IValidatorsProvider,
    @inject("PersonRepository")
    private personRepository: IPersonRepository,
    @inject("ScheduleRepository")
    private scheduleRepository: IScheduleRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider
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

    const [hasProfessional] = await transaction([
      this.personRepository.findActivated(
        clinicId,
        professionalId,
        UserDomainClasses.PROFESSIONAL
      ),
    ]);

    if (!hasProfessional)
      throw new AppError(
        "NOT_FOUND",
        i18n.__mf("ErrorUserIDNotFound", ["profissional"])
      );

    const [saved] = await transaction([
      this.scheduleRepository.saveLockItem(professionalId, {
        date: new Date(date),
        endTime: time2date(endTime),
        startTime: time2date(startTime),
        id: this.uniqueIdentifierProvider.generate(),
      }),
    ]);

    return {
      ...saved,
      date: this.maskProvider.date(saved.date),
      endTime: this.maskProvider.time(new Date(saved.endTime)),
      startTime: this.maskProvider.time(new Date(saved.startTime)),
    };
  }
}

export { CreateScheduleLockService };
