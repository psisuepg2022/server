import { prismaClient } from "@infra/database/client";
import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";
import { WeeklyScheduleModel } from "@models/domain/WeeklyScheduleModel";
import { PrismaPromise } from "@prisma/client";
import { IScheduleRepository } from "@repositories/schedule/models/IScheduleRepository";

class ScheduleRepository implements IScheduleRepository {
  constructor(private prisma = prismaClient) {}

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
}
export { ScheduleRepository };
