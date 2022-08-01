import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { DeleteWeeklyScheduleRequestModel } from "@models/dto/weeklySchedule/DeleteWeeklyScheduleRequestModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IScheduleRepository } from "@repositories/schedule";

@injectable()
class DeleteWeeklyScheduleLockService {
  constructor(
    @inject("ScheduleRepository")
    private scheduleRepository: IScheduleRepository,
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider
  ) {}

  public async execute({
    professionalId,
    weeklyScheduleId,
    weeklyScheduleLockId,
  }: DeleteWeeklyScheduleRequestModel): Promise<boolean> {
    if (stringIsNullOrEmpty(professionalId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorProfessionalRequired"));

    if (stringIsNullOrEmpty(weeklyScheduleId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorWeeklyScheduleRequired"));

    if (stringIsNullOrEmpty(weeklyScheduleLockId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorWeeklyScheduleLockRequired")
      );

    if (
      !this.uniqueIdentifierProvider.isValid(professionalId) ||
      !this.uniqueIdentifierProvider.isValid(weeklyScheduleId) ||
      !this.uniqueIdentifierProvider.isValid(weeklyScheduleLockId)
    )
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const [hasLock] = await transaction([
      this.scheduleRepository.hasLock(
        professionalId,
        weeklyScheduleId,
        weeklyScheduleLockId
      ),
    ]);

    if (!hasLock)
      throw new AppError(
        "NOT_FOUND",
        i18n.__("ErrorWeeklyScheduleLockNotFound")
      );

    const [deleted] = await transaction([
      this.scheduleRepository.deleteLock(weeklyScheduleLockId),
    ]);

    return !!deleted;
  }
}

export { DeleteWeeklyScheduleLockService };
