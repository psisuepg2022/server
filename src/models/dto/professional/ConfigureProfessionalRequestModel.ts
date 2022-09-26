import { ConfigureWeeklyScheduleLocksRequestModel } from "../weeklySchedule/ConfigureWeeklyScheduleRequestModel";

type ConfigureProfessionalRequestModel = {
  userId: string;
  clinicId: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  baseDuration: string;
  weeklySchedule: ConfigureWeeklyScheduleLocksRequestModel[];
};

export { ConfigureProfessionalRequestModel };
