import { inject, injectable } from "tsyringe";

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
}

export { CreateAppointmentsByTheProfessional };
