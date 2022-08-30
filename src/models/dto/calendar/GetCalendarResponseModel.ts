import { AppointmentOnCalendarModel } from "./AppointmentOnCalendarModel";
import { ScheduleLockOnCalendarModel } from "./ScheduleLockOnCalendarModel";
import { WeeklyScheduleOnCalendarModel } from "./WeeklyScheduleOnCalendarModel";

type GetCalendarResponseModel = {
  appointments: AppointmentOnCalendarModel[];
  weeklySchedule: WeeklyScheduleOnCalendarModel[];
  scheduleLocks: ScheduleLockOnCalendarModel[];
};

export { GetCalendarResponseModel };
