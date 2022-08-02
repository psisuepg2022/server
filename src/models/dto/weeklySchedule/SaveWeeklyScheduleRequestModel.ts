import { CreateWeeklyScheduleLockRequestModel } from "./CreateWeeklyScheduleLockRequestModel";

type SaveWeeklyScheduleRequestModel = {
  id: string;
  professionalId: string;
  baseDuration: string;
  startTime: string;
  endTime: string;
  locks: CreateWeeklyScheduleLockRequestModel[];
};

export { SaveWeeklyScheduleRequestModel };
