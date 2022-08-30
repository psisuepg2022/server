import { WeeklyScheduleLockOnCalendarModel } from "./WeeklyScheduleLockOnCalendarModel";

type WeeklyScheduleOnCalendarModel = {
  id: string;
  dayOfTheWeek: string;
  startTime: string;
  endTime: string;
  locks: WeeklyScheduleLockOnCalendarModel[];
};

export { WeeklyScheduleOnCalendarModel };
