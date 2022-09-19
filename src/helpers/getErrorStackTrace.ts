import i18n from "i18n";

import { AppError } from "@handlers/error/AppError";

const getErrorStackTrace = (error: unknown): string => {
  if (error instanceof Error) return error.stack || error.message;
  if (error instanceof AppError) return error.message;

  return i18n.__("ErrorWithoutHandling");
};

export { getErrorStackTrace };
