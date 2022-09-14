import { PrismaClient } from "@prisma/client";

import { cacheMiddleware } from "./cacheMiddleware";
import { handleErrorLog, handleQueryLog } from "./logHandling";

const prismaClient = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
  ],
});

prismaClient.$on("query", handleQueryLog);
prismaClient.$on("error", handleErrorLog);

prismaClient.$use(cacheMiddleware);

export { prismaClient };
