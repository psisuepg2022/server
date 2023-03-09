import path from "path";
import { LoggerOptions, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import { replaceAll } from "@helpers/replaceAll";

const getFormattedTimestamp = (): string =>
  new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

const directory = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "logs",
  replaceAll({
    str: getFormattedTimestamp().split(" ")[0],
    find: "/",
    replace: "-",
  })
);

const options: LoggerOptions = {
  format: format.combine(
    format.label({ label: "LOG" }),
    format.timestamp({ format: getFormattedTimestamp }),
    format.printf(
      ({ level, message, label, timestamp }) =>
        `${timestamp} [${label}] ${level}: ${message}`
    )
  ),
  transports: [
    new DailyRotateFile({
      filename: `${directory}/log_%DATE%.log`,
      datePattern: "HH",
      format: format.combine(
        format.timestamp({ format: getFormattedTimestamp })
      ),
    }),
  ],
};

export { options };
