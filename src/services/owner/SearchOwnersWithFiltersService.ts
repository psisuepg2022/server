import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { pagination } from "@helpers/pagination";
import { transaction } from "@infra/database/transaction";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { OwnerModel } from "@models/domain/OwnerModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ListOwnersResponseModel } from "@models/dto/owner/ListOwnersRespondeModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IOwnerRepository } from "@repositories/owner";
import { IPersonRepository } from "@repositories/person";
import { SearchPeopleWithFiltersService } from "@services/person";

@injectable()
class SearchOwnersWithFiltersService extends SearchPeopleWithFiltersService {
  constructor(
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ValidatorsProvider")
    validatorsProvider: IValidatorsProvider,
    @inject("OwnerRepository")
    private ownerRepository: IOwnerRepository
  ) {
    super(
      personRepository,
      maskProvider,
      uniqueIdentifierProvider,
      validatorsProvider
    );
  }

  protected getDomainClass = (): string => UserDomainClasses.OWNER;

  public async execute(
    clinicId: string,
    { page, size }: IPaginationOptions<SearchPersonRequestModel>
  ): Promise<IPaginationResponse<ListOwnersResponseModel>> {
    const countOperation = this.getCountOperation(clinicId, {});

    const getOperation = this.ownerRepository.get(
      clinicId,
      pagination({ page, size })
    );

    const [totalItems, items] = await transaction([
      countOperation,
      getOperation,
    ]);

    return {
      items: items.map(
        ({
          person,
          ...item
        }: Partial<
          OwnerModel & { person: PersonModel }
        >): ListOwnersResponseModel =>
          ({
            ...item,
            CPF: this.maskProvider.cpf(person?.CPF || ""),
            contactNumber: this.maskProvider.contactNumber(
              person?.contactNumber || ""
            ),
            email: person?.email,
            name: person?.name || "",
            birthDate: this.maskProvider.date(
              new Date(person?.birthDate || "")
            ),
          } as ListOwnersResponseModel)
      ),
      totalItems,
    };
  }
}

export { SearchOwnersWithFiltersService };
