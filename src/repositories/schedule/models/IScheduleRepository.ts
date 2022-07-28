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
}

export { IScheduleRepository };
