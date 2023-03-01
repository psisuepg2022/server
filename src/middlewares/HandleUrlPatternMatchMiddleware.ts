import i18n from "i18n";

import { HttpStatus, IMiddleware } from "@infra/http";
import { logger } from "@infra/log";

class HandleUrlPatternMatchMiddleware {
  public setHasUrlMatchedMiddleware =
    (hasUrlPatternMatched: boolean): IMiddleware =>
    async (req, _, next) => {
      Object.assign(req, { hasUrlPatternMatched });
      return next();
    };

  public verify: IMiddleware<{
    route: string;
    method: string;
  }> = async (
    { originalUrl: route, method, hasUrlPatternMatched },
    res,
    next
  ) => {
    if (hasUrlPatternMatched) return next();

    logger.info(`
    Access attempt to non-existent route: ${route} with ${method} method`);

    res.status(HttpStatus.NOT_FOUND).json({
      message: i18n.__("ErrorRouteNotFound"),
      success: false,
      content: {
        route,
        method,
      },
    });

    return next();
  };
}

export { HandleUrlPatternMatchMiddleware };
