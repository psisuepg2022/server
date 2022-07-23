import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { pagination } from "@helpers/pagination";
import { transaction } from "@infra/database/transaction";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { PersonModel } from "@models/domain/PersonModel";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { UserModel } from "@models/domain/UserModel";
import { ListProfessionalsResponseModel } from "@models/dto/professional/ListProfessionalsResponseModel";
import { IMaskProvider } from "@providers/mask";
import { IProfessionalRepository } from "@repositories/professional";
import { IUserRepository } from "@repositories/user";

@injectable()
class ListProfessionalsService {
  constructor(
    @inject("ProfessionalRepository")
    private professionalRepository: IProfessionalRepository,
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider
  ) {}

  public async execute(
    options?: IPaginationOptions
  ): Promise<IPaginationResponse<ListProfessionalsResponseModel>> {
    const countOperation = this.userRepository.count(
      UserDomainClasses.PROFESSIONAL
    );
    const getOperation = this.professionalRepository.get(
      pagination(options || {})
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

export { ListProfessionalsService };
