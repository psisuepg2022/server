import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { pagination } from "@helpers/pagination";
import { transaction } from "@infra/database/transaction";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { PersonModel } from "@models/domain/PersonModel";
import { ListPeopleResponseModel } from "@models/dto/person/ListPeopleResponseModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { ILiableRepository } from "@repositories/liable";
import { IPersonRepository } from "@repositories/person";
import { SearchPeopleWithFiltersService } from "@services/person";

@injectable()
class SearchLiablesWithFiltersService extends SearchPeopleWithFiltersService {
  constructor(
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ValidatorsProvider")
    validatorsProvider: IValidatorsProvider,
    @inject("LiableRepository")
    private liableRepository: ILiableRepository
  ) {
    super(
      personRepository,
      maskProvider,
      uniqueIdentifierProvider,
      validatorsProvider
    );
  }

  protected getDomainClass = (): string => UserDomainClasses.LIABLE;

  public async execute(
    clinicId: string,
    { page, size, filters }: IPaginationOptions<SearchPersonRequestModel>
  ): Promise<IPaginationResponse<ListPeopleResponseModel>> {
    const countOperation = this.getCountOperation(clinicId, { filters });

    const getOperation = this.liableRepository.get(
      clinicId,
      pagination({ page, size }),
      filters
        ? {
            ...filters,
            CPF: this.maskProvider.remove(filters.CPF || ""),
          }
        : null
    );

    const [totalItems, items] = await transaction([
      countOperation,
      getOperation,
    ]);

    return {
      items: items.map(
        ({
          person,
        }: any & { person: Partial<PersonModel> }): ListPeopleResponseModel =>
          ({
            ...person,
            CPF: this.maskProvider.cpf(person.CPF || ""),
            birthDate: this.maskProvider.date(new Date(person.birthDate || "")),
            contactNumber: this.maskProvider.contactNumber(
              person.contactNumber || ""
            ),
          } as ListPeopleResponseModel)
      ),
      totalItems,
    };
  }
}

export { SearchLiablesWithFiltersService };
