import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { IMiddleware } from "@infra/http";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IClinicRepository } from "@repositories/clinic";

@injectable()
class ValidateClinicIDMiddleware {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ClinicRepository")
    private clinicRepository: IClinicRepository
  ) {}

  public execute =
    (
      execSearchInDB = false,
      authenticated = true,
      paramName = "id"
    ): IMiddleware =>
    async (req, _, next) => {
      const clinicId = authenticated
        ? req.clinic.id
        : req.params[`${paramName}`];

      if (stringIsNullOrEmpty(clinicId))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorClinicRequired"));

      if (!this.uniqueIdentifierProvider.isValid(clinicId))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

      if (execSearchInDB) {
        const [hasClinic] = await transaction([
          this.clinicRepository.getById(clinicId),
        ]);

        if (!hasClinic)
          throw new AppError("BAD_REQUEST", i18n.__("ErrorClinicNotFound"));
      }

      return next();
    };
}

export { ValidateClinicIDMiddleware };
