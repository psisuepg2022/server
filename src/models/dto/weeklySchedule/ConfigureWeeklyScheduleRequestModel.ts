import { CreateWeeklyScheduleLockRequestModel } from "./CreateWeeklyScheduleLockRequestModel";

type ConfigureWeeklyScheduleLocksRequestModel = {
  dayOfTheWeek: string;
  startTime: string;
  endTime: string;
  locks: CreateWeeklyScheduleLockRequestModel[];
};

export { ConfigureWeeklyScheduleLocksRequestModel };
