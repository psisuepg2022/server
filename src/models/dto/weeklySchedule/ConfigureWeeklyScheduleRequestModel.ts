import { CreateWeeklyScheduleLockRequestModel } from "./CreateWeeklyScheduleLockRequestModel";

type ConfigureWeeklyScheduleLocksRequestModel = {
  dayOfTheWeek: string;
  startTime: string;
  endTime: string;
  disableDay?: string | boolean;
  locks: CreateWeeklyScheduleLockRequestModel[];
};

export { ConfigureWeeklyScheduleLocksRequestModel };
