import i18n from "i18n";

import { AppError } from "@handlers/error/AppError";
import { pagination } from "@helpers/pagination";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { AddressModel } from "@models/domain/AddressModel";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ListPeopleResponseModel } from "@models/dto/person/ListPeopleResponseModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IPersonRepository } from "@repositories/person";

class SearchPeopleWithFiltersService<
  T extends ListPeopleResponseModel = ListPeopleResponseModel,
  K extends Partial<
    PersonModel & {
      patient: PatientModel & { liable: any & { person: PersonModel } };
      address: AddressModel;
    }
  > = Partial<
    PersonModel & {
      patient: PatientModel & { liable: any & { person: PersonModel } };
      address: AddressModel;
    }
  >
> {
  constructor(
    protected personRepository: IPersonRepository,
    protected maskProvider: IMaskProvider,
    protected uniqueIdentifierProvider: IUniqueIdentifierProvider,
    protected validatorsProvider: IValidatorsProvider
  ) {}

  protected getDomainClass = (): string => {
    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      i18n.__("ErrorGetDomainClassNotDefined")
    );
  };

  protected getOperation = (
    _: string,
    [__, ___]: [number, number],
    ____: SearchPersonRequestModel | null
  ): PrismaPromise<K[]> => {
    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      i18n.__("ErrorSearchPeopleGetOperationNotDefined")
    );
  };

  protected convertObject = (_: K): T => {
    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      i18n.__("ErrorSearchPeopleConvertObjectNotDefined")
    );
  };

  protected getFilters = (
    filters: SearchPersonRequestModel | null
  ): SearchPersonRequestModel | null =>
    filters
      ? {
          ...filters,
          CPF: this.maskProvider.remove(filters.CPF || ""),
        }
      : null;

  protected covertBase = ({
    address,
    ...item
  }: Partial<
    PersonModel & {
      address: AddressModel;
    }
  >): ListPeopleResponseModel =>
    ({
      email: item.email,
      id: item.id,
      name: item.name,
      CPF: this.maskProvider.cpf(item.CPF || ""),
      birthDate: this.maskProvider.date(new Date(item.birthDate || "")),
      contactNumber: this.maskProvider.contactNumber(item.contactNumber || ""),
      address: address
        ? {
            ...address,
            zipCode: this.maskProvider.zipCode(address.zipCode || ""),
          }
        : null,
    } as ListPeopleResponseModel);

  public async execute(
    clinicId: string,
    { page, size, filters }: IPaginationOptions<SearchPersonRequestModel>
  ): Promise<IPaginationResponse<T>> {
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

    const [totalItems, items] = await transaction([
      countOperation,
      this.getOperation(
        clinicId,
        pagination({ page, size }),
        this.getFilters(filters || null)
      ),
    ]);

    return {
      items: items.map(this.convertObject),
      totalItems,
    };
  }
}

export { SearchPeopleWithFiltersService };
