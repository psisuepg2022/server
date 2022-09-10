import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { AddressModel } from "@models/domain/AddressModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { UserModel } from "@models/domain/UserModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { ListProfessionalsResponseModel } from "@models/dto/professional/ListProfessionalsResponseModel";
import { IMaskProvider } from "@providers/mask";
import { IValidatorsProvider } from "@providers/validators";
import { IPersonRepository } from "@repositories/person";
import { IProfessionalRepository } from "@repositories/professional";
import { SearchPeopleWithFiltersService } from "@services/person";

@injectable()
class SearchProfessionalsWithFiltersService extends SearchPeopleWithFiltersService<
  ListProfessionalsResponseModel,
  Partial<
    UserModel & {
      person: PersonModel & { address: AddressModel };
      professional: ProfessionalModel;
    }
  >
> {
  constructor(
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("ValidatorsProvider")
    validatorsProvider: IValidatorsProvider,
    @inject("ProfessionalRepository")
    private professionalRepository: IProfessionalRepository
  ) {
    super(personRepository, maskProvider, validatorsProvider);
  }

  protected getDomainClass = (): string => UserDomainClasses.PROFESSIONAL;

  protected getOperation = (
    clinicId: string,
    pagination: [number, number],
    filters: SearchPersonRequestModel | null
  ): any =>
    this.professionalRepository.get(
      clinicId,
      pagination,
      this.getFilters(filters)
    );

  protected convertObject = ({
    person,
    professional,
  }: Partial<
    UserModel & {
      person: PersonModel & { address: AddressModel };
      professional: ProfessionalModel;
    }
  >): ListProfessionalsResponseModel =>
    ({
      baseDuration: professional?.baseDuration,
      profession: professional?.profession,
      registry: professional?.registry,
      specialization: professional?.specialization,
      ...this.covertBase(person || {}),
    } as ListProfessionalsResponseModel);
}

export { SearchProfessionalsWithFiltersService };
