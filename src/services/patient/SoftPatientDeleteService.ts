import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { transaction } from "@infra/database/transaction";
import { IDateProvider } from "@providers/date";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IAppointmentRepository } from "@repositories/appointment";
import { IPersonRepository } from "@repositories/person";
import { SoftPersonDeleteService } from "@services/person";

@injectable()
class SoftPatientDeleteService extends SoftPersonDeleteService {
  constructor(
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("AppointmentRepository")
    private appointmentRepository: IAppointmentRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {
    super("paciente", uniqueIdentifierProvider, personRepository);
  }

  protected getDomainClass = (): string => UserDomainClasses.PATIENT;

  public async execute(clinicId: string, id: string): Promise<string> {
    await super.createOperation(clinicId, id);

    const [hasLiable] = await transaction([
      this.personRepository.findLiableToDelete(clinicId, id),
    ]);

    const operations = [
      this.getOperation(),
      this.appointmentRepository.deleteAllUncompletedAppointments(
        "patient",
        id,
        this.dateProvider.now()
      ),
    ];

    if (hasLiable && hasLiable.person?.id)
      operations.push(this.personRepository.safetyDelete(hasLiable.person.id));

    const [_, appointmentsDeleted] = await transaction(operations);

    return i18n.__mf("SuccessPersonWithAppointmentsRelationDeleted", [
      "paciente",
      `${(appointmentsDeleted as { count: number }).count}`,
    ]);
  }
}

export { SoftPatientDeleteService };
