import { NextFunction, Request, Response } from "express";

import { IResponseMessage } from "./IResponseMessage";

interface IMiddleware<T = any> {
  (
    req: Request,
    res: Response<IResponseMessage<T>>,
    next: NextFunction
  ): Promise<void | Response>;
}

export { IMiddleware };
