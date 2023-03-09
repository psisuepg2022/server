import { IMiddleware } from "@infra/http";
import { logger } from "@infra/log";

class LogMiddleware {
  private _getRuntimeFormatted = (start: number, end: number): string =>
    `${Number((end - start) / 1000).toFixed(3)}s`;

  public routeStart: IMiddleware = async ({ method, originalUrl }, _, next) => {
    logger.info(
      `======================== ${method} ${originalUrl} ========================`
    );

    return next();
  };

  public routeEnd: IMiddleware = async (
    { runtime: { end, start } },
    { statusCode, statusMessage },
    next
  ) => {
    logger.info(
      `Request finished with ${statusCode} status code (${statusMessage}) in ${this._getRuntimeFormatted(
        start,
        end
      )}`
    );

    return next();
  };

  public userAuthenticated: IMiddleware = async ({ user, clinic }, _, next) => {
    logger.info(`User Authenticated: ${user.id} (Clinic: ${clinic.id})`);

    return next();
  };
}

export { LogMiddleware };
