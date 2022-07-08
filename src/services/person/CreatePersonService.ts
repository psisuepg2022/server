import i18n from "i18n";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { PersonModel } from "@models/domain/PersonModel";
import { CreatePersonRequestModel } from "@models/dto/person/CreatePersonRequestModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";

class CreatePersonService {
  constructor(
    protected uniqueIdentifierProvider: IUniqueIdentifierProvider,
    protected validatorsProvider: IValidatorsProvider
  ) {}

  protected async createOperation({
    CPF,
    name,
    birthDate,
    contactNumber,
    email,
    address,
  }: CreatePersonRequestModel): Promise<PersonModel> {
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

    if (email && !this.validatorsProvider.email(email))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorEmailInvalid"));

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

    return {} as Promise<PersonModel>;
  }
}

export { CreatePersonService };
