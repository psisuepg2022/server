import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IScheduleRepository } from "@repositories/schedule";

@injectable()
class DeleteScheduleLockService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ScheduleRepository")
    private scheduleRepository: IScheduleRepository
  ) {}

  public async execute(professionalId: string, id: string): Promise<boolean> {
    if (stringIsNullOrEmpty(professionalId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["profissional"])
      );

    if (stringIsNullOrEmpty(id))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorScheduleLockIdRequired"));

    if (
      !this.uniqueIdentifierProvider.isValid(professionalId) ||
      !this.uniqueIdentifierProvider.isValid(id)
    )
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const [hasScheduleLock] = await transaction([
      this.scheduleRepository.getScheduleLock(professionalId, id),
    ]);

    if (!hasScheduleLock)
      throw new AppError("NOT_FOUND", i18n.__("ErrorScheduleLockNotFound"));

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (hasScheduleLock.date < today)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorScheduleLockDeletePastEvent")
      );

    const [deleted] = await transaction([
      this.scheduleRepository.deleteScheduleLock(id),
    ]);

    return !!deleted;
  }
}

export { DeleteScheduleLockService };
