import winston from "winston";

import { options } from "@config/winston";

const logger = winston.createLogger(options);

export { logger };
