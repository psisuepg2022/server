import { PrismaClient } from "@prisma/client";

import { handleErrorLog, handleQueryLog } from "./logHandling";

const prismaClient = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
  ],
});

prismaClient.$on("query", handleQueryLog);
prismaClient.$on("error", handleErrorLog);

// import { cacheMiddleware } from "./cacheMiddleware";
// prismaClient.$use(cacheMiddleware);

export { prismaClient };
