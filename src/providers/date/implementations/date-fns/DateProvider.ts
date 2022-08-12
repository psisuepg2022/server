import { isAfter, format, isBefore } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

import { IDateProvider } from "@providers/date/models/IDateProvider";

class DateProvider implements IDateProvider {
  getUTCDate = (date: string, time?: string): Date =>
    zonedTimeToUtc(new Date(`${date}${time ? ` ${time}` : ""}`), "");

  now = (): Date => zonedTimeToUtc(new Date().toISOString(), "");

  getTodayWithoutTime = (): Date =>
    zonedTimeToUtc(`${format(this.now(), "yyyy-MM-dd")}`, "");

  isAfter = (date: Date, toCompare: Date): boolean => isAfter(date, toCompare);

  isBefore = (date: Date, toCompare: Date): boolean =>
    isBefore(date, toCompare);

  minuteToMilli = (minute: number): number => minute * 6000;

  differenceInMillis = (end: Date, start: Date): number =>
    end.getTime() - start.getTime();

  time2date = (time: string, date = "2022-08-12"): Date =>
    zonedTimeToUtc(`${date} ${time}:00`, "");
}

export { DateProvider };
