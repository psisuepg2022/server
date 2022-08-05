import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { transaction } from "@infra/database/transaction";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IPersonRepository } from "@repositories/person";
import { SoftPersonDeleteService } from "@services/person";

@injectable()
class SoftEmployeeDeleteService extends SoftPersonDeleteService {
  constructor(
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("PersonRepository")
    personRepository: IPersonRepository
  ) {
    super("colaborador", uniqueIdentifierProvider, personRepository);
  }

  protected getDomainClass = (): string => UserDomainClasses.EMPLOYEE;

  public async execute(clinicId: string, id: string): Promise<boolean> {
    await super.createOperation(clinicId, id);

    const [deleted] = await transaction([this.getOperation()]);

    return !!deleted;
  }
}

export { SoftEmployeeDeleteService };
