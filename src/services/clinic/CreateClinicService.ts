import { validate } from "email-validator";
import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { ClinicModel } from "@models/domain/ClinicModel";
import { CreateClinicRequestModel } from "@models/dto/clinic/CreateClinicRequestModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IClinicRepository } from "@repositories/clinic";

@injectable()
class CreateClinicService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ClinicRepository")
    private clinicRepository: IClinicRepository
  ) {}

  public async execute({
    email,
    name,
  }: CreateClinicRequestModel): Promise<ClinicModel> {
    if (stringIsNullOrEmpty(name))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorNameIsRequired"));

    if (stringIsNullOrEmpty(email))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorEmailIsRequired"));

    if (!validate(email))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorEmailInvalid"));

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
    });

    const [clinic] = await transaction([createClinicOperation]);

    return clinic;
  }
}

export { CreateClinicService };
