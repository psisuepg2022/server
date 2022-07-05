import { validate } from "email-validator";
import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { env } from "@helpers/env";
import { toNumber } from "@helpers/toNumber";
import { transaction } from "@infra/database/transaction";
import { ClinicModel } from "@models/domain/ClinicModel";
import { CreateClinicRequestModel } from "@models/dto/clinic/CreateClinicRequestModel";
import { IHashProvider } from "@providers/hash";
import { IPasswordProvider } from "@providers/password";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IClinicRepository } from "@repositories/clinic";

@injectable()
class CreateClinicService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ClinicRepository")
    private clinicRepository: IClinicRepository,
    @inject("HashProvider")
    private hashProvider: IHashProvider,
    @inject("PasswordProvider")
    private passwordProvider: IPasswordProvider
  ) {}

  public async execute({
    email,
    name,
    password,
  }: CreateClinicRequestModel): Promise<Omit<ClinicModel, "password">> {
    if (!name || name === "")
      throw new AppError("BAD_REQUEST", i18n.__("ErrorNameIsRequired"));

    if (!email)
      throw new AppError("BAD_REQUEST", i18n.__("ErrorEmailIsRequired"));

    if (!validate(email))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorEmailInvalid"));

    if (!password)
      throw new AppError("BAD_REQUEST", i18n.__("ErrorPasswordIsRequired"));

    if (!this.passwordProvider.hasStrength(password))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorPasswordToWeak"));

    const salt = toNumber({
      value: env("PASSWORD_HASH_SALT"),
      error: new AppError("BAD_REQUEST", i18n.__("ErrorEnvPasswordHashSalt")),
    });

    const [hasClinic] = await transaction([
      this.clinicRepository.hasEmail(email),
    ]);

    if (hasClinic)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorClinicEmailAlreadyExists")
      );

    const createClinicOperation = this.clinicRepository.save({
      email,
      name,
      id: this.uniqueIdentifierProvider.generate(),
      password: await this.hashProvider.hash(password, salt),
    });

    const [{ password: _, ...clinic }] = await transaction([
      createClinicOperation,
    ]);

    return clinic;
  }
}

export { CreateClinicService };
