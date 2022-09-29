import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { DisableWeeklyScheduleDayRequestModel } from "@models/dto/weeklySchedule/DisableWeeklyScheduleDayRequestModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IProfessionalRepository } from "@repositories/professional";
import { IScheduleRepository } from "@repositories/schedule";

@injectable()
class DisableWeeklyScheduleDayService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ProfessionalRepository")
    private professionalRepository: IProfessionalRepository,
    @inject("ScheduleRepository")
    private scheduleRepository: IScheduleRepository
  ) {}

  public async execute({
    clinicId,
    id,
    professionalId,
  }: DisableWeeklyScheduleDayRequestModel): Promise<boolean> {
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

    const [hasProfessional] = await transaction([
      this.professionalRepository.getBaseDuration(clinicId, professionalId),
    ]);

    if (!hasProfessional)
      throw new AppError(
        "NOT_FOUND",
        i18n.__mf("ErrorUserIDNotFound", ["profissional"])
      );

    const [hasSchedule] = await transaction([
      this.scheduleRepository.hasWeeklySchedule(id, professionalId),
    ]);

    if (!hasSchedule)
      throw new AppError("NOT_FOUND", i18n.__("ErrorWeeklyScheduleNotFound"));

    const [_, weeklyScheduleDeleted] = await transaction([
      this.scheduleRepository.deleteAllsLocksByWeeklySchedule(id),
      this.scheduleRepository.deleteWeeklySchedule(id),
    ]);

    return !!weeklyScheduleDeleted;
  }
}

export { DisableWeeklyScheduleDayService };
