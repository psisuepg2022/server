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
  hasUncompletedAppointmentsByProfessional(
    professionalId: string,
    date: Date
  ): PrismaPromise<{ patientId: string }[] | null>;
  hasUncompletedAppointmentsByDayOfTheWeek(
    type: "weekly" | "lock",
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
  findTodayAppointmentsOutOfRange(
    professionalId: string,
    dayOfTheWeek: number,
    startTime: Date,
    endTime: Date,
    todayStart: Date,
    todayEnd: Date
  ): PrismaPromise<
    {
      id: string;
      name: string;
      appointmentDate: string;
    }[]
  >;
  getByDate(
    professionalId: string,
    date: Date
  ): PrismaPromise<Partial<AppointmentModel> | null>;
}

export { IAppointmentRepository };
