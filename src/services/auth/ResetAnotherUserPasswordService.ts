import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { env } from "@helpers/env";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { toNumber } from "@helpers/toNumber";
import { transaction } from "@infra/database/transaction";
import { ResetAnotherUserPasswordRequestModel } from "@models/dto/auth/ResetAnotherUserPasswordRequestModel";
import { IPasswordProvider } from "@providers/password";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IUserRepository } from "@repositories/user";

@injectable()
class ResetAnotherUserPasswordService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("PasswordProvider")
    private passwordProvider: IPasswordProvider,
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  public async execute({
    clinicId,
    confirmNewPassword,
    newPassword,
    userId,
  }: ResetAnotherUserPasswordRequestModel): Promise<boolean> {
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

    if (stringIsNullOrEmpty(userId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["usuário"])
      );

    if (!this.uniqueIdentifierProvider.isValid(userId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

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

    const [hasUser] = await transaction([
      this.userRepository.findUserToResetPassword(clinicId, userId),
    ]);

    if (!hasUser)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDNotFound", ["usuário"])
      );

    const salt = toNumber({
      value: env("PASSWORD_HASH_SALT"),
      error: new AppError(
        "INTERNAL_SERVER_ERROR",
        i18n.__("ErrorMissingEnvVar")
      ),
    });

    return true;
  }
}

export { ResetAnotherUserPasswordService };
