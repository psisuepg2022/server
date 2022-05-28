class AppError extends Error {
  public readonly message: string;

  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }

  public static getErrorStatusCode(error: any): number {
    return error instanceof AppError ? error.statusCode : 500;
  }

  public static getErrorMessage(error: any): string {
    return error instanceof AppError
      ? error.message
      : "Ocorreu um erro interno.";
  }
}

export { AppError };
