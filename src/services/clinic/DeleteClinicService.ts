import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { transaction } from "@infra/database/transaction";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IClinicRepository } from "@repositories/clinic";

@injectable()
class DeleteClinicService {
  constructor(
    @inject("ClinicRepository")
    private clinicRepository: IClinicRepository,
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider
  ) {}

  public async execute(id: string): Promise<boolean> {
    if (!id || id === "")
      throw new AppError("BAD_REQUEST", i18n.__("ErrorIdIsRequired"));

    if (!this.uniqueIdentifierProvider.isValid(id))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const getByIdOperation = this.clinicRepository.getById(id);

    const [hasClinic] = await transaction([getByIdOperation]);

    if (!hasClinic)
      throw new AppError("NOT_FOUND", i18n.__("ErrorClinicNotFound"));

    const deleteOperation = this.clinicRepository.delete(id);
    const [deleted] = await transaction([deleteOperation]);

    return !!deleted;
  }
}

export { DeleteClinicService };
