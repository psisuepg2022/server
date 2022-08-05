import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { transaction } from "@infra/database/transaction";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IPersonRepository } from "@repositories/person";
import { SoftPersonDeleteService } from "@services/person";

@injectable()
class SoftPatientDeleteService extends SoftPersonDeleteService {
  constructor(
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("PersonRepository")
    personRepository: IPersonRepository
  ) {
    super("paciente", uniqueIdentifierProvider, personRepository);
  }

  protected getDomainClass = (): string => UserDomainClasses.PATIENT;

  public async execute(clinicId: string, id: string): Promise<boolean> {
    await super.createOperation(clinicId, id);

    const [hasLiable] = await transaction([
      this.personRepository.findLiableToDelete(clinicId, id),
    ]);

    const operations = [this.getOperation()];

    if (hasLiable && hasLiable.person?.id)
      operations.push(this.personRepository.safetyDelete(hasLiable.person.id));

    const [patientDeleted, _] = await transaction(operations);

    return !!patientDeleted;
  }
}

export { SoftPatientDeleteService };
