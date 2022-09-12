import path from "path";
import { LoggerOptions, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const directory = path.join(__dirname, "..", "..", "..", "log", "db");

const options: LoggerOptions = {
  format: format.combine(
    format.label({ label: "LOG" }),
    format.timestamp(),
    format.printf(
      ({ level, message, label, timestamp }) =>
        `${timestamp} [${label}] ${level}: ${message}`
    )
  ),
  transports: [
    new DailyRotateFile({ filename: `${directory}/log-%DATE%.log` }),
  ],
};

export { options };
