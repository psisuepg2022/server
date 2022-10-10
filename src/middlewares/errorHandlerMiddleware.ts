import { NextFunction, Request, Response } from "express";

import { i18n } from "@config/i18n";
import { AppError } from "@handlers/error/AppError";
import { getErrorStackTrace } from "@helpers/getErrorStackTrace";
import { databaseErrorHandling } from "@infra/database/handlers/databaseErrorHandling";
import { HttpStatus, IResponseMessage } from "@infra/http";
import { logger } from "@infra/log";

const errorHandlerMiddleware = async (
  err: Error,
  _: Request,
  res: Response<IResponseMessage>,
  next: NextFunction
): Promise<void> => {
  logger.error(getErrorStackTrace(err));

  const [statusCode, message, content] = ((): [
    number,
    string,
    Record<string, unknown> | undefined
  ] => {
    if (err instanceof AppError)
      return [err.statusCode, err.message, err.content];

    const isDbError = databaseErrorHandling(err);
    if (isDbError) return [...isDbError, undefined];

    return [
      HttpStatus.INTERNAL_SERVER_ERROR,
      i18n.__("ErrorGenericUnknown"),
      undefined,
    ];
  })();

  res.status(statusCode).json({
    message,
    content,
    success: false,
  });

  return next();
};

export { errorHandlerMiddleware };
