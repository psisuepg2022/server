import { zonedTimeToUtc } from "date-fns-tz";

import { IDateProvider } from "@providers/date/models/IDateProvider";

class DateProvider implements IDateProvider {
  now = (): Date => zonedTimeToUtc(new Date().toISOString(), "");
}

export { DateProvider };
