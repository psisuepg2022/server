import { prismaClient } from "@infra/database/client";
import { IMiddleware } from "@infra/http";

const databaseDisconnectMiddleware: IMiddleware = async (_, __, next) => {
  prismaClient.$disconnect();
  return next();
};

export { databaseDisconnectMiddleware };
