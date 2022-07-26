import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { pagination } from "@helpers/pagination";
import { transaction } from "@infra/database/transaction";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { OwnerModel } from "@models/domain/OwnerModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ListOwnersResponseModel } from "@models/dto/owner/ListOwnersRespondeModel";
import { IMaskProvider } from "@providers/mask";
import { IOwnerRepository } from "@repositories/owner";
import { IUserRepository } from "@repositories/user";

@injectable()
class ListOwnersService {
  constructor(
    @inject("OwnerRepository")
    private ownerRepository: IOwnerRepository,
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider
  ) {}

  public async execute(
    options?: IPaginationOptions
  ): Promise<IPaginationResponse<ListOwnersResponseModel>> {
    const countOperation = this.userRepository.count(UserDomainClasses.OWNER);
    const getOperation = this.ownerRepository.get(pagination(options || {}));

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

export { ListOwnersService };
