import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { PersonModel } from "@models/domain/PersonModel";
import { ListPeopleResponseModel } from "@models/dto/person/ListPeopleResponseModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { IMaskProvider } from "@providers/mask";
import { IValidatorsProvider } from "@providers/validators";
import { ILiableRepository } from "@repositories/liable";
import { IPersonRepository } from "@repositories/person";
import { SearchPeopleWithFiltersService } from "@services/person";

@injectable()
class SearchLiablesWithFiltersService extends SearchPeopleWithFiltersService<
  ListPeopleResponseModel,
  any & { person: Partial<PersonModel> }
> {
  constructor(
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("ValidatorsProvider")
    validatorsProvider: IValidatorsProvider,
    @inject("LiableRepository")
    private liableRepository: ILiableRepository
  ) {
    super(personRepository, maskProvider, validatorsProvider);
  }

  protected getDomainClass = (): string => UserDomainClasses.LIABLE;

  protected getOperation = (
    clinicId: string,
    pagination: [number, number],
    filters: SearchPersonRequestModel | null
  ): any =>
    this.liableRepository.get(clinicId, pagination, this.getFilters(filters));

  protected convertObject = ({
    person,
  }: any & { person: Partial<PersonModel> }): ListPeopleResponseModel =>
    ({
      ...this.covertBase(person),
    } as ListPeopleResponseModel);
}

export { SearchLiablesWithFiltersService };
