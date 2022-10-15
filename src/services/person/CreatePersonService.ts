import i18n from "i18n";

import { VarcharMaxLength } from "@common/VarcharMaxLength";
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

  protected getObjectId = (id?: string): string =>
    id && !stringIsNullOrEmpty(id) && this.uniqueIdentifierProvider.isValid(id)
      ? id
      : this.uniqueIdentifierProvider.generate();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected handlingHasCpf = (_: string): void => {};

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
    const CPFConverted = await (async (): Promise<string | null> => {
      if (!CPFRequired)
        return !stringIsNullOrEmpty(CPF) && this.validatorsProvider.cpf(CPF)
          ? this.maskProvider.remove(CPF)
          : null;

      if (stringIsNullOrEmpty(CPF))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorCPFIsRequired"));

      if (!this.validatorsProvider.cpf(CPF))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorCPFInvalid"));

      const _CPFConverted = this.maskProvider.remove(CPF);

      if (
        !this.validatorsProvider.length(
          _CPFConverted,
          VarcharMaxLength.PERSON_CPF
        )
      )
        throw new AppError(
          "BAD_REQUEST",
          i18n.__mf("ErrorVarcharMaxLength", [
            "CPF",
            VarcharMaxLength.PERSON_CPF,
          ])
        );

      const [hasCPF] = await transaction([
        this.personRepository.hasCPF(
          clinicId,
          domainClass,
          id,
          this.maskProvider.remove(CPF)
        ),
      ]);

      if (hasCPF) {
        this.handlingHasCpf(hasCPF.domainClass);
        throw new AppError("BAD_REQUEST", i18n.__("ErrorCPFAlreadyExists"));
      }

      return _CPFConverted;
    })();

    if (stringIsNullOrEmpty(name))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorNameIsRequired"));

    if (!this.validatorsProvider.length(name, VarcharMaxLength.PERSON_NAME))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorVarcharMaxLength", [
          "Nome",
          VarcharMaxLength.PERSON_NAME,
        ])
      );

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

      if (!this.validatorsProvider.length(email, VarcharMaxLength.PERSON_EMAIL))
        throw new AppError(
          "BAD_REQUEST",
          i18n.__mf("ErrorVarcharMaxLength", [
            "E-mail",
            VarcharMaxLength.PERSON_EMAIL,
          ])
        );

      const [hasEmail] = await transaction([
        this.personRepository.hasEmail(clinicId, id, email),
      ]);

      if (hasEmail)
        throw new AppError(
          "BAD_REQUEST",
          i18n.__("ErrorClinicEmailAlreadyExists")
        );
    }

    const contactNumberConverted = ((): string | null => {
      if (!contactNumber) return null;

      if (!this.validatorsProvider.contactNumber(contactNumber))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorContactNumberInvalid"));

      const _contactNumberConverted = this.maskProvider.remove(contactNumber);

      if (
        !this.validatorsProvider.length(
          _contactNumberConverted,
          VarcharMaxLength.PERSON_CONTACT_NUMBER
        )
      )
        throw new AppError(
          "BAD_REQUEST",
          i18n.__mf("ErrorVarcharMaxLength", [
            "Telefone para Contato",
            VarcharMaxLength.PERSON_CONTACT_NUMBER,
          ])
        );

      return _contactNumberConverted;
    })();

    if (address) {
      if (stringIsNullOrEmpty(address.city))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorCityRequired"));

      if (
        !this.validatorsProvider.length(
          address.city,
          VarcharMaxLength.ADDRESS_CITY
        )
      )
        throw new AppError(
          "BAD_REQUEST",
          i18n.__mf("ErrorVarcharMaxLength", [
            "Cidade",
            VarcharMaxLength.ADDRESS_CITY,
          ])
        );

      if (stringIsNullOrEmpty(address.publicArea))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorPublicAreaRequired"));

      if (
        !this.validatorsProvider.length(
          address.publicArea,
          VarcharMaxLength.ADDRESS_PUBLIC_AREA
        )
      )
        throw new AppError(
          "BAD_REQUEST",
          i18n.__mf("ErrorVarcharMaxLength", [
            "Logradouro",
            VarcharMaxLength.ADDRESS_PUBLIC_AREA,
          ])
        );

      if (stringIsNullOrEmpty(address.state))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorStateRequired"));

      if (
        !this.validatorsProvider.length(
          address.state,
          VarcharMaxLength.ADDRESS_STATE
        )
      )
        throw new AppError(
          "BAD_REQUEST",
          i18n.__mf("ErrorVarcharMaxLength", [
            "Estado",
            VarcharMaxLength.ADDRESS_STATE,
          ])
        );

      const zipCodeConverted = ((): string => {
        if (stringIsNullOrEmpty(address.zipCode))
          throw new AppError("BAD_REQUEST", i18n.__("ErrorZipCodeRequired"));

        if (!this.validatorsProvider.zipCode(address.zipCode))
          throw new AppError("BAD_REQUEST", i18n.__("ErrorZipCodeInvalid"));

        const _zipCodeConverted = this.maskProvider.remove(address.zipCode);

        if (
          !this.validatorsProvider.length(
            _zipCodeConverted,
            VarcharMaxLength.ADDRESS_ZIP_CODE
          )
        )
          throw new AppError(
            "BAD_REQUEST",
            i18n.__mf("ErrorVarcharMaxLength", [
              "CEP",
              VarcharMaxLength.ADDRESS_ZIP_CODE,
            ])
          );

        return _zipCodeConverted;
      })();

      if (
        !this.validatorsProvider.length(
          address.district || "",
          VarcharMaxLength.ADDRESS_DISTRICT
        )
      )
        throw new AppError(
          "BAD_REQUEST",
          i18n.__mf("ErrorVarcharMaxLength", [
            "Bairro",
            VarcharMaxLength.ADDRESS_DISTRICT,
          ])
        );

      this.addressOperation = this.addressRepository.save(id, {
        ...address,
        id: this.getObjectId(address.id),
        zipCode: zipCodeConverted,
      });
    }

    this.personOperation = this.personRepository.save(clinicId, {
      birthDate: birthDateConverted,
      contactNumber: contactNumberConverted,
      CPF: CPFConverted,
      email: email || null,
      id,
      name,
      domainClass,
    } as PersonModel);
  }
}

export { CreatePersonService };
