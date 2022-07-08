import i18n from "i18n";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { PersonModel } from "@models/domain/PersonModel";
import { CreatePersonRequestModel } from "@models/dto/person/CreatePersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IClinicRepository } from "@repositories/clinic";
import { IPersonRepository } from "@repositories/person";

class CreatePersonService {
  private personOperation?: PrismaPromise<PersonModel>;

  constructor(
    protected validatorsProvider: IValidatorsProvider,
    protected personRepository: IPersonRepository,
    protected clinicRepository: IClinicRepository,
    protected maskProvider: IMaskProvider,
    protected uniqueIdentifierProvider: IUniqueIdentifierProvider
  ) {}

  protected getCreatePersonOperation = (): PrismaPromise<PersonModel> => {
    if (this.personOperation) return this.personOperation;

    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      i18n.__("ErrorBaseCreateOperationFailed")
    );
  };

  protected async createPersonOperation(
    {
      CPF,
      name,
      birthDate,
      contactNumber,
      email,
      clinicId,
      address,
    }: CreatePersonRequestModel,
    id: string,
    domainClass: string
  ): Promise<void> {
    if (stringIsNullOrEmpty(CPF))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorCPFIsRequired"));

    if (!this.validatorsProvider.cpf(CPF))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorCPFInvalid"));

    if (stringIsNullOrEmpty(name))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorNameIsRequired"));

    if (!birthDate)
      throw new AppError("BAD_REQUEST", i18n.__("ErrorBirthDateRequired"));

    if (new Date().getTime() < birthDate.getTime())
      throw new AppError("BAD_REQUEST", i18n.__("ErrorBirthDateInvalid"));

    if (stringIsNullOrEmpty(clinicId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorClinicRequired"));

    if (!this.uniqueIdentifierProvider.isValid(clinicId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const [hasClinic] = await transaction([
      this.clinicRepository.getById(clinicId),
    ]);

    if (!hasClinic)
      throw new AppError("BAD_REQUEST", i18n.__("ErrorClinicNotFound"));

    if (email) {
      if (!this.validatorsProvider.email(email))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorEmailInvalid"));

      const [hasEmail] = await transaction([
        this.personRepository.hasEmail(email),
      ]);

      if (hasEmail)
        throw new AppError(
          "BAD_REQUEST",
          i18n.__("ErrorClinicEmailAlreadyExists")
        );
    }

    if (contactNumber && !this.validatorsProvider.contactNumber(contactNumber))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorContactNumberInvalid"));

    if (address) {
      if (!address.city || address.city === "")
        throw new AppError("BAD_REQUEST", i18n.__("ErrorCityRequired"));

      if (!address.district || address.district === "")
        throw new AppError("BAD_REQUEST", i18n.__("ErrorDistrictRequired"));

      if (!address.publicArea || address.publicArea === "")
        throw new AppError("BAD_REQUEST", i18n.__("ErrorPublicAreaRequired"));
    }

    this.personOperation = this.personRepository.save({
      birthDate,
      contactNumber: this.maskProvider.remove(contactNumber || ""),
      CPF: this.maskProvider.remove(CPF),
      email,
      id,
      name,
      domainClass,
      clinicId,
    });
  }
}

export { CreatePersonService };
