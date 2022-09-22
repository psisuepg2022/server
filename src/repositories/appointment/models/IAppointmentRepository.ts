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
  get(
    professionalId: string,
    startDate: Date,
    endDate: Date,
    today: Date,
    toIgnore: { id: string; appointmentDate: Date }[]
  ): PrismaPromise<
    Partial<AppointmentModel> & { patient: { person: Partial<PersonModel> } }[]
  >;
  getAppointmentDatesByStatus(
    professionalId: string,
    startDate: Date,
    today: Date,
    statusList: number[]
  ): PrismaPromise<{ id: string; appointmentDate: Date }[]>;
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
  deleteAllUncompletedAppointments(
    entity: "patient" | "professional",
    id: string,
    date: Date
  ): PrismaPromise<{ count: number }>;
  getById(
    professionalId: string,
    appointmentId: string
  ): PrismaPromise<AppointmentModel | null>;
}

export { IAppointmentRepository };
