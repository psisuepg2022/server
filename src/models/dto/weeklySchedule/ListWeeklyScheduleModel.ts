import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";

type ListWeeklyScheduleModel = {
  id: string;
  dayOfTheWeek: string;
  endTime: string;
  startTime: string;
  WeeklyScheduleLocks: WeeklyScheduleLockModel[];
};

export { ListWeeklyScheduleModel };
