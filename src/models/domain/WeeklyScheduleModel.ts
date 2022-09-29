import { DaysOfTheWeek } from "@infra/domains";

type WeeklyScheduleModel = {
  id: string;
  startTime: Date;
  endTime: Date;
  dayOfTheWeek: DaysOfTheWeek;
};

export { WeeklyScheduleModel };
