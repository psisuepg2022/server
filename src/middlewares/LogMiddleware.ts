import { IMiddleware } from "@infra/http";
import { logger } from "@infra/log";

class LogMiddleware {
  public routeStart: IMiddleware = async ({ method, originalUrl }, _, next) => {
    logger.info(
      `======================== ${method} ${originalUrl} ========================`
    );

    return next();
  };

  public routeEnd: IMiddleware = async (
    _,
    { statusCode, statusMessage },
    next
  ) => {
    logger.info(
      `Request finished with ${statusCode} status code (${statusMessage})`
    );

    return next();
  };
}

export { LogMiddleware };
