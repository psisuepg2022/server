interface IDateProvider {
  now(): Date;
  getTodayWithoutTime(): Date;
  getUTCDate(date: string, time?: string): Date;
  isAfter(date: Date, toCompare: Date): boolean;
  isBefore(date: Date, toCompare: Date): boolean;
  minuteToMilli(minute: number): number;
  differenceInMillis(end: Date, start: Date): number;
  time2date(time: string, date?: string): Date;
  getWeekDay(date: Date): number;
  getCurrentWeek(): [Date, Date];
  differenceInDays(left: Date, rigth: Date): number;
  differenceInYears(left: Date, rigth: Date): number;
  addMinutes(date: Date, hours: number): Date;
  equals(start: Date, end: Date): boolean;
  intervalConflicting(
    left: { start: Date; end: Date },
    rigth: { start: Date; end: Date }
  ): boolean;
}

export { IDateProvider };
