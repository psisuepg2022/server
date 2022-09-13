import { IMiddleware } from "@infra/http";
import { logger } from "@infra/log";

const logMiddleware: IMiddleware = async (req, _, next) => {
  logger.info(
    `============================ ${req.method} ${req.originalUrl} ============================`
  );
  return next();
};

export { logMiddleware };
