import i18n from "i18n";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { IPaginationOptions } from "@infra/http";
import { AddressModel } from "@models/domain/AddressModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ListPeopleResponseModel } from "@models/dto/person/ListPeopleResponseModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IPersonRepository } from "@repositories/person";

class SearchPeopleWithFiltersService {
  constructor(
    protected personRepository: IPersonRepository,
    protected maskProvider: IMaskProvider,
    protected uniqueIdentifierProvider: IUniqueIdentifierProvider,
    protected validatorsProvider: IValidatorsProvider
  ) {}

  protected getDomainClass = (): string => {
    throw new AppError("INTERNAL_SERVER_ERROR", i18n.__("ErrorGeneric"));
  };

  protected getCountOperation(
    clinicId: string,
    { filters }: IPaginationOptions<SearchPersonRequestModel>
  ): PrismaPromise<number> {
    if (stringIsNullOrEmpty(clinicId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorClinicRequired"));

    if (!this.uniqueIdentifierProvider.isValid(clinicId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    if (filters?.CPF && !this.validatorsProvider.cpf(filters?.CPF))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorCPFInvalid"));

    const countOperation = this.personRepository.count(
      clinicId,
      this.getDomainClass(),
      filters
        ? {
            ...filters,
            CPF: this.maskProvider.remove(filters.CPF || ""),
          }
        : null
    );

    return countOperation;
  }

  protected convert = (
    person: PersonModel,
    address?: AddressModel
  ): ListPeopleResponseModel => ({
    ...person,
    CPF: this.maskProvider.cpf(person.CPF || ""),
    birthDate: this.maskProvider.date(new Date(person.birthDate || "")),
    contactNumber: this.maskProvider.contactNumber(person.contactNumber || ""),
    address: address
      ? {
          ...address,
          zipCode: this.maskProvider.zipCode(address.zipCode || ""),
        }
      : null,
  });

  protected getFilters = (
    filters?: SearchPersonRequestModel
  ): SearchPersonRequestModel | null =>
    filters
      ? {
          ...filters,
          CPF: this.maskProvider.remove(filters.CPF || ""),
        }
      : null;
}

export { SearchPeopleWithFiltersService };
