import { i18n } from "@config/i18n";
import { HttpStatus } from "@infra/http";

class AppError extends Error {
  public readonly message: string;

  public readonly statusCode: HttpStatus;

  constructor(statusCode: keyof typeof HttpStatus, message: string) {
    super();
    this.message = message;
    this.statusCode = HttpStatus[statusCode];
  }

  public static getErrorStatusCode(error: any): HttpStatus {
    return error instanceof AppError
      ? error.statusCode
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  public static getErrorMessage(error: any): string {
    return error instanceof AppError ? error.message : i18n.__("ErrorGeneric");
  }
}

export { AppError };
