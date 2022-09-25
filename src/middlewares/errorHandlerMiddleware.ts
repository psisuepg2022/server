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
  __: NextFunction
): Promise<Response> => {
  logger.error(getErrorStackTrace(err));

  const [statusCode, message] = ((): [number, string] => {
    if (err instanceof AppError) return [err.statusCode, err.message];

    const isDbError = databaseErrorHandling(err);
    if (isDbError) return isDbError;

    return [HttpStatus.INTERNAL_SERVER_ERROR, i18n.__("ErrorGenericUnknown")];
  })();

  return res.status(statusCode).json({
    message,
    success: false,
  });
};

export { errorHandlerMiddleware };
