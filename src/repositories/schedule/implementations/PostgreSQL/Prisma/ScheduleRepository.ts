import { prismaClient } from "@infra/database/client";
import { AppointmentStatus } from "@infra/domains";
import { AppointmentModel } from "@models/domain/AppointmentModel";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ScheduleLockModel } from "@models/domain/ScheduleLockModel";
import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";
import { WeeklyScheduleModel } from "@models/domain/WeeklyScheduleModel";
import { PrismaPromise } from "@prisma/client";
import { IScheduleRepository } from "@repositories/schedule/models/IScheduleRepository";

class ScheduleRepository implements IScheduleRepository {
  constructor(private prisma = prismaClient) {}

  public hasAppointment = (
    professionalId: string,
    startDate: Date,
    endDate: Date
  ): PrismaPromise<
    | (Partial<AppointmentModel> & {
        patient: Partial<PatientModel> & { person: Partial<PersonModel> };
      })
    | null
  > =>
    this.prisma.appointment.findFirst({
      where: {
        professionalId,
        AND: [
          {
            status: {
              in: [AppointmentStatus.COMPLETED, AppointmentStatus.SCHEDULED],
            },
          },
          { appointmentDate: { lt: endDate } },
          { appointmentDate: { gte: startDate } },
        ],
      },
      select: {
        appointmentDate: true,
        id: true,
        patient: {
          select: {
            person: {
              select: { name: true },
            },
          },
        },
      },
    }) as PrismaPromise<
      | (Partial<AppointmentModel> & {
          patient: Partial<PatientModel> & { person: Partial<PersonModel> };
        })
      | null
    >;

  public saveAppointment = (
    professionalId: string,
    employeeId: string,
    patientId: string,
    { appointmentDate, id, status }: AppointmentModel
  ): PrismaPromise<AppointmentModel> =>
    this.prisma.appointment.create({
      data: {
        id,
        appointmentDate,
        status,
        employeeId,
        professionalId,
        patientId,
      },
    }) as PrismaPromise<AppointmentModel>;

  public getScheduleLock = (
    professionalId: string,
    id: string
  ): PrismaPromise<ScheduleLockModel | null> =>
    this.prisma.scheduleLock.findFirst({
      where: {
        id,
        professionalId,
      },
    });

  public deleteScheduleLock = (id: string): PrismaPromise<ScheduleLockModel> =>
    this.prisma.scheduleLock.delete({
      where: {
        id,
      },
    });

  public saveLockItem = (
    professionalId: string,
    { date, endTime, id, startTime }: ScheduleLockModel
  ): PrismaPromise<ScheduleLockModel> =>
    this.prisma.scheduleLock.create({
      data: {
        date,
        endTime,
        id,
        startTime,
        professionalId,
      },
      select: {
        date: true,
        endTime: true,
        id: true,
        startTime: true,
      },
    });

  public getWeeklySchedule = (
    professionalId: string
  ): PrismaPromise<
    (WeeklyScheduleModel & { WeeklyScheduleLocks: WeeklyScheduleLockModel[] })[]
  > =>
    this.prisma.weeklySchedule.findMany({
      where: {
        professionalId,
      },
      select: {
        id: true,
        dayOfTheWeek: true,
        endTime: true,
        startTime: true,
        WeeklyScheduleLocks: {
          select: {
            id: true,
            endTime: true,
            startTime: true,
          },
        },
      },
    }) as PrismaPromise<
      (WeeklyScheduleModel & {
        WeeklyScheduleLocks: WeeklyScheduleLockModel[];
      })[]
    >;

  public saveWeeklyScheduleItem = (
    professionalId: string,
    { dayOfTheWeek, endTime, id, startTime }: WeeklyScheduleModel
  ): PrismaPromise<WeeklyScheduleModel> =>
    this.prisma.weeklySchedule.create({
      data: {
        id,
        dayOfTheWeek,
        endTime,
        startTime,
        professionalId,
      },
    });

  public saveWeeklyScheduleLockItem = (
    weeklyScheduleId: string,
    { endTime, id, startTime }: WeeklyScheduleLockModel
  ): PrismaPromise<WeeklyScheduleLockModel> =>
    this.prisma.weeklyScheduleLock.create({
      data: { endTime, id, startTime, weeklyScheduleId },
    });

  public hasLock = (
    professionalId: string,
    weeklyScheduleId: string,
    weeklyScheduleLockId: string
  ): PrismaPromise<WeeklyScheduleLockModel | null> =>
    this.prisma.weeklyScheduleLock.findFirst({
      where: {
        id: weeklyScheduleLockId,
        weeklyScheduleId,
        weeklySchedule: {
          professionalId,
        },
      },
    });

  public deleteLock = (id: string): PrismaPromise<WeeklyScheduleLockModel> =>
    this.prisma.weeklyScheduleLock.delete({
      where: { id },
    });

  public hasWeeklySchedule = (
    id: string,
    professionalId: string
  ): PrismaPromise<WeeklyScheduleModel | null> =>
    this.prisma.weeklySchedule.findFirst({
      where: {
        id,
        professionalId,
      },
    });

  public updateSchedule = ({
    id,
    endTime,
    startTime,
  }: WeeklyScheduleModel): PrismaPromise<WeeklyScheduleModel> =>
    this.prisma.weeklySchedule.update({
      where: { id },
      data: {
        startTime,
        endTime,
      },
    });

  public hasConflictingScheduleLock = (
    professionalId: string,
    startTime: Date,
    endTime: Date,
    date: Date
  ): PrismaPromise<ScheduleLockModel | null> =>
    this.prisma.scheduleLock.findFirst({
      where: {
        professionalId,
        OR: [
          {
            date,
            endTime,
            startTime,
          },
          {
            date,
            endTime: {
              lt: endTime,
              gt: startTime,
            },
          },
          {
            date,
            startTime: {
              lt: endTime,
              gt: startTime,
            },
          },
        ],
      },
      select: {
        date: true,
        endTime: true,
        startTime: true,
        id: true,
      },
    });

  public hasConflictingWeeklyScheduleLock = (
    weeklyScheduleId: string,
    startTime: Date,
    endTime: Date
  ): PrismaPromise<
    | (WeeklyScheduleLockModel & {
        weeklySchedule: Partial<WeeklyScheduleModel>;
      })
    | null
  > =>
    this.prisma.weeklyScheduleLock.findFirst({
      where: {
        weeklyScheduleId,
        OR: [
          {
            startTime,
            endTime,
          },
          {
            endTime: {
              lt: endTime,
              gt: startTime,
            },
          },
          {
            startTime: {
              lt: endTime,
              gt: startTime,
            },
          },
        ],
      },
      select: {
        endTime: true,
        id: true,
        startTime: true,
        weeklySchedule: {
          select: {
            dayOfTheWeek: true,
          },
        },
      },
    });
}
export { ScheduleRepository };
