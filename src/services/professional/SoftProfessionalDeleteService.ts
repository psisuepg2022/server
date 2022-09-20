import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { transaction } from "@infra/database/transaction";
import { PersonModel } from "@models/domain/PersonModel";
import { SoftProfessionalDeleteResponseModel } from "@models/dto/professional/SoftProfessionalDeleteResponseModel";
import { IDateProvider } from "@providers/date";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IAppointmentRepository } from "@repositories/appointment";
import { IPersonRepository } from "@repositories/person";
import { SoftPersonDeleteService } from "@services/person";

@injectable()
class SoftProfessionalDeleteService extends SoftPersonDeleteService {
  constructor(
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("AppointmentRepository")
    private appointmentRepository: IAppointmentRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider
  ) {
    super("profissional", uniqueIdentifierProvider, personRepository);
  }

  protected getDomainClass = (): string => UserDomainClasses.PROFESSIONAL;

  public async execute(
    clinicId: string,
    id: string
  ): Promise<SoftProfessionalDeleteResponseModel> {
    await super.createOperation(clinicId, id);

    const [appointmentsToRemoval] = await transaction([
      this.appointmentRepository.getAllUncompletedAppointments(
        "professional",
        id,
        this.dateProvider.now()
      ),
    ]);

    const [_, appointmentsDeleted] = await transaction([
      this.getOperation(),
      this.appointmentRepository.deleteAllUncompletedAppointments(
        "professional",
        id,
        this.dateProvider.now()
      ),
    ]);

    return {
      header: i18n.__mf("SuccessPersonWithAppointmentsRelationDeleted", [
        "profissional",
        `${(appointmentsDeleted as { count: number }).count}`,
      ]),
      patientsToCall: appointmentsToRemoval.map(
        ({
          patient: {
            person: { contactNumber, name, email },
          },
        }): Partial<PersonModel> => ({
          name,
          email,
          contactNumber: this.maskProvider.contactNumber(contactNumber || ""),
        })
      ),
    };
  }
}

export { SoftProfessionalDeleteService };
