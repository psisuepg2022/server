import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { transaction } from "@infra/database/transaction";
import { IDateProvider } from "@providers/date";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IAppointmentRepository } from "@repositories/appointment";
import { IPersonRepository } from "@repositories/person";
import { IProfessionalRepository } from "@repositories/professional";
import { IScheduleRepository } from "@repositories/schedule";

import { CreateAppointmentService } from "./CreateAppointmentService";

@injectable()
class CreateAppointmentsByTheProfessional extends CreateAppointmentService {
  constructor(
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ValidatorsProvider")
    validatorsProvider: IValidatorsProvider,
    @inject("ProfessionalRepository")
    professionalRepository: IProfessionalRepository,
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("ScheduleRepository")
    scheduleRepository: IScheduleRepository,
    @inject("DateProvider")
    dateProvider: IDateProvider,
    @inject("AppointmentRepository")
    appointmentRepository: IAppointmentRepository
  ) {
    super(
      uniqueIdentifierProvider,
      validatorsProvider,
      professionalRepository,
      personRepository,
      maskProvider,
      scheduleRepository,
      dateProvider,
      appointmentRepository
    );
  }

  protected validatePatient = async (
    _: string,
    patientId: string,
    professionalId: string
  ): Promise<void> => {
    const [hasPatient] = await transaction([
      this.professionalRepository.hasPatientWithPastAppointments(
        professionalId,
        patientId
      ),
    ]);

    if (!hasPatient)
      throw new AppError(
        "NOT_FOUND",
        i18n.__("ErrorAppointmentPatientWithoutAppointmentsWithTheProfessional")
      );
  };
}

export { CreateAppointmentsByTheProfessional };
