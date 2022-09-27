import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";

type SaveWeeklyScheduleResponseModel = {
  id: string;
  startTime: string;
  endTime: string;
  locks: WeeklyScheduleLockModel[];
};

export { SaveWeeklyScheduleResponseModel };
