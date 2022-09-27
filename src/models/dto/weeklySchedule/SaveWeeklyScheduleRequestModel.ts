import { CreateWeeklyScheduleLockRequestModel } from "./CreateWeeklyScheduleLockRequestModel";

type SaveWeeklyScheduleRequestModel = {
  id: string;
  professionalId: string;
  clinicId: string;
  startTime: string;
  endTime: string;
  locks: CreateWeeklyScheduleLockRequestModel[];
};

export { SaveWeeklyScheduleRequestModel };
