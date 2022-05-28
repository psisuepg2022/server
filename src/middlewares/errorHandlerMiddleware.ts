import { AppError } from "@handlers/error/AppError";
import { IMiddleware } from "@infra/http";

const errorHandlerMiddleware: IMiddleware = async (err, _, res, __) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Ocorreu um erro interno no servidor.",
  });
};

export { errorHandlerMiddleware };
