interface IDateProvider {
  now(): Date;
  getTodayWithoutTime(): Date;
  getUTCDate(date: string, time?: string): Date;
  isAfter(date: Date, toCompare: Date): boolean;
  isBefore(date: Date, toCompare: Date): boolean;
  minuteToMilli(minute: number): number;
  differenceInMillis(end: Date, start: Date): number;
  time2date(time: string, date?: string): Date;
}

export { IDateProvider };
