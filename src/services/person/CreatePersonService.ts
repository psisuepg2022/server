import i18n from "i18n";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { PersonModel } from "@models/domain/PersonModel";
import { CreatePersonRequestModel } from "@models/dto/person/CreatePersonRequestModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IPersonRepository } from "@repositories/person";

class CreatePersonService {
  constructor(
    protected uniqueIdentifierProvider: IUniqueIdentifierProvider,
    protected validatorsProvider: IValidatorsProvider,
    protected personRepository: IPersonRepository
  ) {}

  protected async createOperation(
    {
      CPF,
      name,
      birthDate,
      contactNumber,
      email,
      clinicId,
      address,
    }: CreatePersonRequestModel,
    domainClass: string
  ): Promise<PersonModel> {
    if (stringIsNullOrEmpty(CPF))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorCPFIsRequired"));

    if (!this.validatorsProvider.cpf(CPF))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorCPFInvalid"));

    console.log("sem mascara", CPF.replace(/[^0-9]+/g, ""));

    if (stringIsNullOrEmpty(name))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorNameIsRequired"));

    if (!birthDate)
      throw new AppError("BAD_REQUEST", i18n.__("ErrorBirthDateRequired"));

    if (new Date().getTime() < birthDate.getTime())
      throw new AppError("BAD_REQUEST", i18n.__("ErrorBirthDateInvalid"));

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

    console.log("sem mascara", contactNumber?.replace(/[^0-9]+/g, ""));

    if (address) {
      if (!address.city || address.city === "")
        throw new AppError("BAD_REQUEST", i18n.__("ErrorCityRequired"));

      if (!address.district || address.district === "")
        throw new AppError("BAD_REQUEST", i18n.__("ErrorDistrictRequired"));

      if (!address.publicArea || address.publicArea === "")
        throw new AppError("BAD_REQUEST", i18n.__("ErrorPublicAreaRequired"));
    }

    return this.personRepository.save({
      birthDate,
      contactNumber,
      CPF,
      email,
      id: this.uniqueIdentifierProvider.generate(),
      name,
      domainClass,
      clinicId,
    });
  }
}

export { CreatePersonService };
