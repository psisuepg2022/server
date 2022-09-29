import { AppointmentModel } from "@models/domain/AppointmentModel";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";

interface IAppointmentRepository {
  hasAppointmentByStatus(
    professionalId: string,
    startDate: Date,
    endDate: Date,
    statusList: number[]
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
  get(
    professionalId: string,
    startDate: Date,
    endDate: Date
  ): PrismaPromise<
    Partial<AppointmentModel> & { patient: { person: Partial<PersonModel> } }[]
  >;
  findToUpdateStatus(id: string): PrismaPromise<{
    id: string;
    status: number;
    appointmentDate: Date;
    professional: { baseDuration: number };
  } | null>;
  updateStatus(
    id: string,
    status: number,
    updatedAt: Date
  ): PrismaPromise<
    Partial<AppointmentModel> & { patient: { person: Partial<PersonModel> } }
  >;
  findToUpdateComment(
    id: string,
    professionalId: string
  ): PrismaPromise<Partial<AppointmentModel> | null>;
  getAllUncompletedAppointments(
    entity: "patient" | "professional",
    id: string,
    date: Date
  ): PrismaPromise<{ patient: { person: Partial<PersonModel> } }[]>;
  hasUncompletedAppointmentsByDayOfTheWeek(
    professionalId: string,
    dayOfTheWeek: number,
    today: Date,
    startTime: Date | null,
    endTime: Date | null
  ): PrismaPromise<Partial<AppointmentModel>[]>;
  deleteAllUncompletedAppointments(
    entity: "patient" | "professional",
    id: string,
    date: Date
  ): PrismaPromise<{ count: number }>;
  getById(
    professionalId: string,
    appointmentId: string
  ): PrismaPromise<AppointmentModel | null>;
  deleteById(id: string): PrismaPromise<Partial<AppointmentModel>>;
}

export { IAppointmentRepository };
