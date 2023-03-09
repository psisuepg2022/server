import path from "path";
import { LoggerOptions, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const directory = path.join(__dirname, "..", "..", "..", "logs");

const options: LoggerOptions = {
  format: format.combine(
    format.label({ label: "LOG" }),
    format.timestamp({
      format: () => {
        return new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        });
      },
    }),
    format.printf(
      ({ level, message, label, timestamp }) =>
        `${timestamp} [${label}] ${level}: ${message}`
    )
  ),
  transports: [
    new DailyRotateFile({
      filename: `${directory}/log_%DATE%.log`,
      datePattern: "YYYY-MM-DD",
    }),
  ],
};

export { options };
