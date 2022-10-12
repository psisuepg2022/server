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
import { IPatientRepository } from "@repositories/patient";
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
    private maskProvider: IMaskProvider,
    @inject("PatientRepository")
    private patientRepository: IPatientRepository
  ) {
    super("profissional", uniqueIdentifierProvider, personRepository);
  }

  protected getDomainClass = (): string => UserDomainClasses.PROFESSIONAL;

  public async execute(
    clinicId: string,
    id: string
  ): Promise<SoftProfessionalDeleteResponseModel> {
    await super.createOperation(clinicId, id);

    const [hasPatients] = await transaction([
      this.appointmentRepository.hasUncompletedAppointmentsByProfessional(
        id,
        this.dateProvider.now()
      ),
    ]);

    const patientsToCall = await (async (): Promise<Partial<PersonModel>[]> => {
      if (!hasPatients || hasPatients.length === 0) return [];

      const [_patientsToCall] = await transaction([
        this.patientRepository.getByIdList(
          clinicId,
          hasPatients.map(({ patientId }) => patientId)
        ),
      ]);

      return _patientsToCall.map(
        ({ contactNumber, name, email }): Partial<PersonModel> => ({
          name,
          email,
          contactNumber: this.maskProvider.contactNumber(contactNumber || ""),
        })
      );
    })();

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
      patientsToCall,
    };
  }
}

export { SoftProfessionalDeleteService };
