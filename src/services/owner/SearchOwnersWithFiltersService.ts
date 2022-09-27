import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { OwnerModel } from "@models/domain/OwnerModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ListOwnersResponseModel } from "@models/dto/owner/ListOwnersRespondeModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { IMaskProvider } from "@providers/mask";
import { IValidatorsProvider } from "@providers/validators";
import { IOwnerRepository } from "@repositories/owner";
import { IPersonRepository } from "@repositories/person";
import { SearchPeopleWithFiltersService } from "@services/person";

@injectable()
class SearchOwnersWithFiltersService extends SearchPeopleWithFiltersService<
  ListOwnersResponseModel,
  Partial<OwnerModel & { person: PersonModel }>
> {
  constructor(
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("ValidatorsProvider")
    validatorsProvider: IValidatorsProvider,
    @inject("OwnerRepository")
    private ownerRepository: IOwnerRepository
  ) {
    super(personRepository, maskProvider, validatorsProvider);
  }

  protected getDomainClass = (): string => UserDomainClasses.OWNER;

  protected getOperation = (
    clinicId: string,
    pagination: [number, number],
    _: SearchPersonRequestModel | null
  ): any => this.ownerRepository.get(clinicId, pagination);

  protected convertObject = ({
    userName,
    person,
  }: Partial<OwnerModel & { person: PersonModel }>): ListOwnersResponseModel =>
    ({
      userName,
      ...this.covertBase(person || {}),
    } as ListOwnersResponseModel);
}

export { SearchOwnersWithFiltersService };
