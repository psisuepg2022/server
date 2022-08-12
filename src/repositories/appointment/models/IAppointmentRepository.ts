import { AppointmentModel } from "@models/domain/AppointmentModel";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";

interface IAppointmentRepository {
  hasAppointment(
    professionalId: string,
    startDate: Date,
    endDate: Date
  ): PrismaPromise<
    | (Partial<AppointmentModel> & {
        patient: Partial<PatientModel> & { person: Partial<PersonModel> };
      })
    | null
  >;
  saveAppointment(
    professionalId: string,
    employeeId: string,
    patientId: string,
    appointment: AppointmentModel
  ): PrismaPromise<AppointmentModel>;
}

export { IAppointmentRepository };
