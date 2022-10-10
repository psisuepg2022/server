import { i18n } from "@config/i18n";
import { HttpStatus } from "@infra/http";

class AppError<T = any> extends Error {
  public readonly message: string;

  public readonly statusCode: HttpStatus;

  public readonly content?: T;

  constructor(
    statusCode: keyof typeof HttpStatus,
    message: string,
    content?: T
  ) {
    super();
    this.message = message;
    this.statusCode = HttpStatus[statusCode];
    this.content = content;
  }

  public static getErrorStatusCode(error: any): HttpStatus {
    return error instanceof AppError
      ? error.statusCode
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  public static getErrorMessage(error: any): string {
    return error instanceof AppError
      ? error.message
      : i18n.__("ErrorGenericUnknown");
  }
}

export { AppError };
