import { inject, injectable } from "tsyringe";

import { RolesKeys } from "@common/RolesKeys";
import { transaction } from "@infra/database/transaction";
import { UserModel } from "@models/domain/UserModel";
import { PrismaPromise } from "@prisma/client";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IPersonRepository } from "@repositories/person";
import { IUserRepository } from "@repositories/user";
import { SoftPersonDeleteService } from "@services/person";

@injectable()
class SoftProfessionalDeleteService extends SoftPersonDeleteService<Partial<UserModel> | null> {
  constructor(
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {
    super("profissional", uniqueIdentifierProvider, personRepository);
  }

  protected findToDelete = (
    clinicId: string,
    id: string
  ): PrismaPromise<Partial<UserModel> | null> =>
    this.userRepository.getToDelete(clinicId, id, RolesKeys.PROFESSIONAL);

  public async execute(clinicId: string, id: string): Promise<boolean> {
    await super.createOperation(clinicId, id);

    const [deleted] = await transaction([this.getOperation()]);

    return !!deleted;
  }
}

export { SoftProfessionalDeleteService };
