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

  public userAuthenticated: IMiddleware = async ({ user, clinic }, _, next) => {
    logger.info(`User Authenticated: ${user.id} (Clinic: ${clinic.id})`);

    return next();
  };
}

export { LogMiddleware };
