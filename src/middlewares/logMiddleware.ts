import { IMiddleware } from "@infra/http";
import { logger } from "@infra/log";

const logMiddleware =
  (msg: string): IMiddleware =>
  async (_, __, next) => {
    logger.info(
      `============================ ${msg} ============================`
    );
    return next();
  };

export { logMiddleware };
