import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";

type SaveWeeklyScheduleResponseModel = {
  id: string;
  baseDuration: number;
  startTime: string;
  endTime: string;
  locks: WeeklyScheduleLockModel[];
};

export { SaveWeeklyScheduleResponseModel };
