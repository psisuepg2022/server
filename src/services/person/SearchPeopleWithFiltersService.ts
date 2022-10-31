import i18n from "i18n";

import { AppError } from "@handlers/error/AppError";
import { pagination } from "@helpers/pagination";
import { transaction } from "@infra/database/transaction";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { AddressModel } from "@models/domain/AddressModel";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ListPeopleResponseModel } from "@models/dto/person/ListPeopleResponseModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IMaskProvider } from "@providers/mask";
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
  >,
  P extends SearchPersonRequestModel = SearchPersonRequestModel
> {
  constructor(
    protected personRepository: IPersonRepository,
    protected maskProvider: IMaskProvider,
    protected validatorsProvider: IValidatorsProvider
  ) {}

  protected getDomainClass = (): string => {
    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      i18n.__("ErrorWithoutHandling")
    );
  };

  protected getOperation = (
    _: string,
    [__, ___]: [number, number],
    ____: P | null
  ): PrismaPromise<K[]> => {
    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      i18n.__("ErrorWithoutHandling")
    );
  };

  protected countOperation = (
    clinicId: string,
    filters: P | null
  ): PrismaPromise<number> =>
    this.personRepository.count(
      clinicId,
      this.getDomainClass(),
      filters
        ? {
            ...filters,
            CPF: this.maskProvider.remove(filters.CPF || ""),
          }
        : null
    );

  protected convertObject = (_: K): T => {
    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      i18n.__("ErrorWithoutHandling")
    );
  };

  protected getFilters = (filters: P | null): P | null =>
    filters
      ? {
          ...filters,
          composed:
            filters.composed && this.validatorsProvider.cpf(filters.composed)
              ? this.maskProvider.remove(filters.composed)
              : filters.composed,
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
    { page, size, filters }: IPaginationOptions<P>
  ): Promise<IPaginationResponse<T>> {
    if (filters?.CPF && !this.validatorsProvider.cpf(filters?.CPF || ""))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorCPFInvalid"));

    const [totalItems, items] = await transaction([
      this.countOperation(clinicId, this.getFilters(filters || null)),
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
