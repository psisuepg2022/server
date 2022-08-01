import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";

type ListWeeklyScheduleResponseModel = {
  id: string;
  dayOfTheWeek: string;
  endTime: string;
  startTime: string;
  WeeklyScheduleLocks: WeeklyScheduleLockModel[];
};

export { ListWeeklyScheduleResponseModel };
