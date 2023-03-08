import { performance } from "node:perf_hooks";

import { IMiddleware } from "@infra/http";

class SetRuntimeMiddleware {
  public start: IMiddleware = async (req, _, next) => {
    Object.assign(req, { runtime: { start: performance.now() } });

    return next();
  };

  public end: IMiddleware = async (req, _, next) => {
    Object.assign(req, {
      runtime: { start: req.runtime.start, end: performance.now() },
    });

    return next();
  };
}

export { SetRuntimeMiddleware };
