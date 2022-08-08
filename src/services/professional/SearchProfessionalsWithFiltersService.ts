import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { pagination } from "@helpers/pagination";
import { transaction } from "@infra/database/transaction";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { PersonModel } from "@models/domain/PersonModel";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { UserModel } from "@models/domain/UserModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { ListProfessionalsResponseModel } from "@models/dto/professional/ListProfessionalsResponseModel";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IPersonRepository } from "@repositories/person";
import { IProfessionalRepository } from "@repositories/professional";
import { SearchPeopleWithFiltersService } from "@services/person";

@injectable()
class SearchProfessionalsWithFiltersService extends SearchPeopleWithFiltersService {
  constructor(
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ValidatorsProvider")
    validatorsProvider: IValidatorsProvider,
    @inject("ProfessionalRepository")
    private professionalRepository: IProfessionalRepository
  ) {
    super(
      personRepository,
      maskProvider,
      uniqueIdentifierProvider,
      validatorsProvider
    );
  }

  protected getDomainClass = (): string => UserDomainClasses.PROFESSIONAL;

  public async execute(
    clinicId: string,
    { page, size, filters }: IPaginationOptions<SearchPersonRequestModel>
  ): Promise<IPaginationResponse<ListProfessionalsResponseModel>> {
    const countOperation = this.getCountOperation(clinicId, { filters });

    const getOperation = this.professionalRepository.get(
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
          professional,
          ...item
        }: Partial<
          UserModel & { person: PersonModel; professional: ProfessionalModel }
        >): ListProfessionalsResponseModel =>
          ({
            ...item,
            ...professional,
            CPF: this.maskProvider.cpf(person?.CPF || ""),
            contactNumber: this.maskProvider.contactNumber(
              person?.contactNumber || ""
            ),
            email: person?.email,
            name: person?.name || "",
            birthDate: this.maskProvider.date(
              new Date(person?.birthDate || "")
            ),
          } as ListProfessionalsResponseModel)
      ),
      totalItems,
    };
  }
}

export { SearchProfessionalsWithFiltersService };
