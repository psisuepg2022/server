import ptBR, {
  isAfter,
  format,
  isBefore,
  getDay,
  startOfWeek,
  endOfWeek,
  differenceInDays,
  addMinutes,
  isEqual,
} from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

import { IDateProvider } from "@providers/date/models/IDateProvider";

class DateProvider implements IDateProvider {
  getUTCDate = (date: string, time?: string): Date =>
    zonedTimeToUtc(
      new Date(`${date}${time ? ` ${time}:00.000Z` : ""}`),
      "America/Sao_Paulo",
      { locale: ptBR }
    );

  now = (): Date => zonedTimeToUtc(new Date().toISOString(), "");

  getTodayWithoutTime = (): Date =>
    zonedTimeToUtc(`${format(this.now(), "yyyy-MM-dd")}`, "America/Sao_Paulo", {
      locale: ptBR,
    });

  isAfter = (date: Date, toCompare: Date): boolean => isAfter(date, toCompare);

  isBefore = (date: Date, toCompare: Date): boolean =>
    isBefore(date, toCompare);

  minuteToMilli = (minute: number): number => minute * 6000;

  differenceInMillis = (end: Date, start: Date): number =>
    end.getTime() - start.getTime();

  time2date = (time: string, date = "2022-08-12"): Date =>
    zonedTimeToUtc(`${date} ${time}:00.000Z`, "America/Sao_Paulo", {
      locale: ptBR,
    });

  getWeekDay = (date: Date): number => getDay(date) + 1;

  differenceInDays = (left: Date, rigth: Date): number =>
    differenceInDays(left, rigth);

  getCurrentWeek = (): [Date, Date] => [
    zonedTimeToUtc(
      startOfWeek(this.now(), {
        weekStartsOn: 0,
      }),
      ""
    ),
    zonedTimeToUtc(
      endOfWeek(this.now(), {
        weekStartsOn: 0,
      }),
      ""
    ),
  ];

  addMinutes = (date: Date, hours: number): Date => addMinutes(date, hours);

  equals = (start: Date, end: Date): boolean => isEqual(start, end);

  intervalConflicting = (
    left: { start: Date; end: Date },
    rigth: { start: Date; end: Date }
  ): boolean =>
    (this.equals(rigth.start, left.start) &&
      this.equals(rigth.end, left.end)) ||
    (this.isBefore(left.start, rigth.end) &&
      this.isAfter(left.start, rigth.start)) ||
    (this.isBefore(left.end, rigth.end) && this.isAfter(left.end, rigth.start));
}

export { DateProvider };
