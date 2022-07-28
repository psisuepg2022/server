import { DaysOfTheWeek } from "@infra/domains";

type WeeklyScheduleModel = {
  id: string;
  startTime: Date | string;
  endTime: Date | string;
  dayOfTheWeek: DaysOfTheWeek;
};

export { WeeklyScheduleModel };
