import i18n from "i18n";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { AddressModel } from "@models/domain/AddressModel";
import { PersonModel } from "@models/domain/PersonModel";
import { CreatePersonRequestModel } from "@models/dto/person/CreatePersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IAddressRepository } from "@repositories/address";
import { IClinicRepository } from "@repositories/clinic";
import { IPersonRepository } from "@repositories/person";

class CreatePersonService {
  private personOperation?: PrismaPromise<Partial<PersonModel>>;

  private addressOperation?: PrismaPromise<Partial<AddressModel>>;

  constructor(
    protected validatorsProvider: IValidatorsProvider,
    protected personRepository: IPersonRepository,
    protected clinicRepository: IClinicRepository,
    protected maskProvider: IMaskProvider,
    protected uniqueIdentifierProvider: IUniqueIdentifierProvider,
    protected addressRepository: IAddressRepository
  ) {}

  protected getCreatePersonOperation = (): PrismaPromise<
    Partial<PersonModel>
  > => {
    if (this.personOperation) return this.personOperation;

    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      i18n.__("ErrorBaseCreateOperationFailed")
    );
  };

  protected getAddressOperation = (): PrismaPromise<Partial<AddressModel>> => {
    if (this.addressOperation) return this.addressOperation;

    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      i18n.__("ErrorBaseCreateOperationFailed")
    );
  };

  protected validateClinicId = async (clinicId: string): Promise<void> => {
    if (stringIsNullOrEmpty(clinicId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorClinicRequired"));

    if (!this.uniqueIdentifierProvider.isValid(clinicId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const [hasClinic] = await transaction([
      this.clinicRepository.getById(clinicId),
    ]);

    if (!hasClinic)
      throw new AppError("BAD_REQUEST", i18n.__("ErrorClinicNotFound"));
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
    domainClass: string,
    CPFRequired = true
  ): Promise<void> {
    if (CPFRequired) {
      if (stringIsNullOrEmpty(CPF))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorCPFIsRequired"));

      if (!this.validatorsProvider.cpf(CPF))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorCPFInvalid"));

      const [hasCPF] = await transaction([
        this.personRepository.hasCPF(id, this.maskProvider.remove(CPF)),
      ]);

      if (hasCPF)
        throw new AppError("BAD_REQUEST", i18n.__("ErrorCPFAlreadyExists"));
    }

    if (stringIsNullOrEmpty(name))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorNameIsRequired"));

    if (!birthDate)
      throw new AppError("BAD_REQUEST", i18n.__("ErrorBirthDateRequired"));

    if (!this.validatorsProvider.date(birthDate))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorBirthDateInvalid"));

    const birthDateConverted = new Date(birthDate);

    if (new Date().getTime() < birthDateConverted.getTime())
      throw new AppError("BAD_REQUEST", i18n.__("ErrorFutureBirthDate"));

    if (email) {
      if (!this.validatorsProvider.email(email))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorEmailInvalid"));

      const [hasEmail] = await transaction([
        this.personRepository.hasEmail(id, email),
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
      if (stringIsNullOrEmpty(address.city))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorCityRequired"));

      if (stringIsNullOrEmpty(address.publicArea))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorPublicAreaRequired"));

      if (stringIsNullOrEmpty(address.state))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorStateRequired"));

      if (stringIsNullOrEmpty(address.zipCode))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorZipCodeRequired"));

      if (!this.validatorsProvider.zipCode(address.zipCode))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorZipCodeInvalid"));

      this.addressOperation = this.addressRepository.save(id, {
        id: this.uniqueIdentifierProvider.generate(),
        ...address,
        zipCode: this.maskProvider.remove(address.zipCode),
      });
    }

    this.personOperation = this.personRepository.save(clinicId, {
      birthDate: birthDateConverted,
      contactNumber: contactNumber
        ? this.maskProvider.remove(contactNumber)
        : null,
      CPF: CPFRequired ? this.maskProvider.remove(CPF) : null,
      email: email || null,
      id,
      name,
      domainClass,
    });
  }
}

export { CreatePersonService };
