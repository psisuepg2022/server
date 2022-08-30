import { WeeklyScheduleLockOnCalendarModel } from "./WeeklyScheduleLockOnCalendarModel";

type WeeklyScheduleOnCalendarModel = {
  id: string;
  dayOfTheWeek: number;
  startTime: string;
  endTime: string;
  locks: WeeklyScheduleLockOnCalendarModel[];
};

export { WeeklyScheduleOnCalendarModel };
