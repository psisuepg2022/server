import { prismaClient } from "@infra/database/client";
import { ScheduleLockModel } from "@models/domain/ScheduleLockModel";
import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";
import { WeeklyScheduleModel } from "@models/domain/WeeklyScheduleModel";
import { PrismaPromise } from "@prisma/client";
import { IScheduleRepository } from "@repositories/schedule/models/IScheduleRepository";

class ScheduleRepository implements IScheduleRepository {
  constructor(private prisma = prismaClient) {}

  public getScheduleLockByInterval = (
    professionalId: string,
    startDate: Date,
    endDate: Date
  ): PrismaPromise<ScheduleLockModel[]> =>
    this.prisma.scheduleLock.findMany({
      where: {
        professionalId,
        date: { lte: endDate, gte: startDate },
      },
    });

  public hasTimeWithoutLock = (
    professionalId: string,
    dayOfTheWeek: number,
    startTime: Date,
    endTime: Date
  ): PrismaPromise<WeeklyScheduleModel | null> =>
    this.prisma.weeklySchedule.findFirst({
      where: {
        professionalId,
        dayOfTheWeek,
        startTime: { lte: startTime },
        endTime: { gte: endTime },
        NOT: [
          {
            WeeklyScheduleLocks: {
              some: {
                OR: [
                  {
                    startTime: { lte: startTime },
                    endTime: { gte: endTime },
                  },
                  {
                    startTime: {
                      lt: endTime,
                      gt: startTime,
                    },
                  },
                  {
                    endTime: {
                      lt: endTime,
                      gt: startTime,
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    });

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
      orderBy: { dayOfTheWeek: "asc" },
    }) as PrismaPromise<
      (WeeklyScheduleModel & {
        WeeklyScheduleLocks: WeeklyScheduleLockModel[];
      })[]
    >;

  public saveWeeklyScheduleItem = (
    professionalId: string,
    { dayOfTheWeek, endTime, id, startTime }: WeeklyScheduleModel
  ): PrismaPromise<WeeklyScheduleModel> =>
    this.prisma.weeklySchedule.upsert({
      where: { id },
      create: {
        id,
        dayOfTheWeek,
        endTime,
        startTime,
        professionalId,
      },
      update: {
        startTime,
        endTime,
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

  public deleteAllsLocksByWeeklySchedule = (
    weeklyScheduleId: string
  ): PrismaPromise<any> =>
    this.prisma.weeklyScheduleLock.deleteMany({
      where: {
        weeklyScheduleId,
      },
    });

  public deleteWeeklySchedule = (
    id: string
  ): PrismaPromise<WeeklyScheduleModel> =>
    this.prisma.weeklySchedule.delete({
      where: { id },
    });

  public hasDayOfTheWeekDuplicated = (
    id: string,
    professionalId: string,
    dayOfTheWeek: number
  ): PrismaPromise<{ id: string } | null> =>
    this.prisma.weeklySchedule.findFirst({
      where: {
        professionalId,
        dayOfTheWeek,
        id: { not: id },
      },
      select: { id: true },
    });

  public hasWeeklyScheduleOutOfRange = (
    professionalId: string,
    dayOfTheWeek: number,
    startTime: Date,
    endTime: Date
  ): PrismaPromise<{ id: string; startTime: Date; endTime: Date } | null> =>
    this.prisma.weeklyScheduleLock.findFirst({
      where: {
        weeklySchedule: { professionalId, dayOfTheWeek },
        NOT: [
          {
            startTime: { gte: startTime },
            endTime: { lte: endTime },
          },
        ],
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
    });
}
export { ScheduleRepository };
