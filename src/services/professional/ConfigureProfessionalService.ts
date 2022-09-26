import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { toNumber } from "@helpers/toNumber";
import { transaction } from "@infra/database/transaction";
import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";
import { ConfigureProfessionalRequestModel } from "@models/dto/professional/ConfigureProfessionalRequestModel";
import { ConfigureWeeklyScheduleLocksRequestModel } from "@models/dto/weeklySchedule/ConfigureWeeklyScheduleRequestModel";
import { PrismaPromise, WeeklySchedule } from "@prisma/client";
import { IDateProvider } from "@providers/date";
import { IPasswordProvider } from "@providers/password";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IProfessionalRepository } from "@repositories/professional";

@injectable()
class ConfigureProfessionalService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ProfessionalRepository")
    private professionalRepository: IProfessionalRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("PasswordProvider")
    private passwordProvider: IPasswordProvider
  ) {}

  public async execute({
    userId,
    clinicId,
    baseDuration,
    confirmNewPassword,
    newPassword,
    oldPassword,
    weeklySchedule,
  }: ConfigureProfessionalRequestModel): Promise<void> {
    if (stringIsNullOrEmpty(userId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["profissional"])
      );

    if (!this.uniqueIdentifierProvider.isValid(userId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    if (stringIsNullOrEmpty(baseDuration))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorBaseDurationRequired"));

    const baseDurationConverted = toNumber({
      value: baseDuration,
      error: new AppError("BAD_REQUEST", i18n.__("ErrorBaseDurationInvalid")),
    });

    if (stringIsNullOrEmpty(oldPassword))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorResetPasswdOldPasswordRequired")
      );

    if (stringIsNullOrEmpty(newPassword))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorResetPasswdNewPasswordRequired")
      );

    if (stringIsNullOrEmpty(confirmNewPassword))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorResetPasswdConfirmNewPasswordRequired")
      );

    if (newPassword !== confirmNewPassword)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorResetPasswdNewPasswordAndConfirmAreNotEqual")
      );

    if (this.passwordProvider.outOfBounds(newPassword))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorPasswordOutOfBounds", [
          this.passwordProvider.MIN_LENGTH,
          this.passwordProvider.MAX_LENGTH,
        ])
      );

    if (!this.passwordProvider.hasStrength(newPassword))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorPasswordToWeak"));

    if (!weeklySchedule)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorConfigureProfessionalWeeklyScheduleRequired")
      );

    const createWeeklyScheduleOperations: PrismaPromise<WeeklySchedule>[] = [];
    const createLocksOperations: PrismaPromise<WeeklyScheduleLockModel>[] = [];

    if (Array.isArray(weeklySchedule) && weeklySchedule.length > 0)
      weeklySchedule.forEach(
        (
          item: ConfigureWeeklyScheduleLocksRequestModel,
          index: number
        ): void => {
          console.log(item, index);
          createLocksOperations.push();
          createWeeklyScheduleOperations.push();
        }
      );

    const [hasProfessional] = await transaction([
      this.professionalRepository.getToConfigure(clinicId, userId),
    ]);

    if (!hasProfessional)
      throw new AppError(
        "NOT_FOUND",
        i18n.__mf("ErrorUserIDNotFound", ["profissional"])
      );

    console.log("");
  }
}

export { ConfigureProfessionalService };
