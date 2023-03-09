import { ScheduleLockModel } from "@models/domain/ScheduleLockModel";
import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";
import { WeeklyScheduleModel } from "@models/domain/WeeklyScheduleModel";
import { PrismaPromise } from "@prisma/client";

interface IScheduleRepository {
  saveWeeklyScheduleItem(
    professionalId: string,
    schedule: WeeklyScheduleModel
  ): PrismaPromise<WeeklyScheduleModel>;
  saveWeeklyScheduleLockItem(
    weeklyScheduleId: string,
    lock: WeeklyScheduleLockModel
  ): PrismaPromise<WeeklyScheduleLockModel>;
  saveLockItem(
    professionalId: string,
    lock: ScheduleLockModel
  ): PrismaPromise<ScheduleLockModel>;
  getWeeklySchedule(
    professionalId: string
  ): PrismaPromise<
    (WeeklyScheduleModel & { WeeklyScheduleLocks: WeeklyScheduleLockModel[] })[]
  >;
  hasTimeWithoutLock(
    professionalId: string,
    dayOfTheWeek: number,
    startTime: Date,
    endTime: Date
  ): PrismaPromise<WeeklyScheduleModel | null>;
  hasLock(
    professionalId: string,
    weeklyScheduleId: string,
    weeklyScheduleLockId: string
  ): PrismaPromise<WeeklyScheduleLockModel | null>;
  hasWeeklySchedule(
    id: string,
    professionalId: string
  ): PrismaPromise<WeeklyScheduleModel | null>;
  deleteLock(id: string): PrismaPromise<WeeklyScheduleLockModel>;
  deleteAllsLocksByWeeklySchedule(weeklyScheduleId: string): PrismaPromise<any>;
  hasConflictingWeeklyScheduleLock(
    weeklyScheduleId: string,
    startTime: Date,
    endTime: Date
  ): PrismaPromise<
    | (WeeklyScheduleLockModel & {
        weeklySchedule: Partial<WeeklyScheduleModel>;
      })
    | null
  >;
  hasConflictingScheduleLock(
    professionalId: string,
    startTime: Date,
    endTime: Date,
    date: Date
  ): PrismaPromise<ScheduleLockModel | null>;
  getScheduleLock(
    professionalId: string,
    id: string
  ): PrismaPromise<ScheduleLockModel | null>;
  getScheduleLockByInterval(
    professionalId: string,
    startDate: Date,
    endDate: Date
  ): PrismaPromise<ScheduleLockModel[]>;
  deleteScheduleLock(id: string): PrismaPromise<ScheduleLockModel>;
  deleteWeeklySchedule(id: string): PrismaPromise<WeeklyScheduleModel>;
  hasDayOfTheWeekDuplicated(
    id: string,
    professionalId: string,
    dayOfTheWeek: number
  ): PrismaPromise<{ id: string } | null>;
  hasWeeklyScheduleOutOfRange(
    professionalId: string,
    dayOfTheWeek: number,
    startTime: Date,
    endTime: Date
  ): PrismaPromise<{ id: string; startTime: Date; endTime: Date } | null>;
}

export { IScheduleRepository };
