import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";

type SaveWeeklyScheduleResponseModel = {
  id: string;
  startTime: string;
  endTime: string;
  dayOfTheWeek: string;
  locks: WeeklyScheduleLockModel[];
};

export { SaveWeeklyScheduleResponseModel };
