import { PrismaClient } from "@prisma/client";

import {
  handleErrorLog,
  handleInfoLog,
  handleQueryLog,
  handleWarnLog,
} from "./logHandling";

const prismaClient = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
    { emit: "event", level: "info" },
    { emit: "event", level: "warn" },
  ],
});

prismaClient.$on("query", handleQueryLog);
prismaClient.$on("error", handleErrorLog);
prismaClient.$on("info", handleInfoLog);
prismaClient.$on("warn", handleWarnLog);

// import { cacheMiddleware } from "./cacheMiddleware";
// prismaClient.$use(cacheMiddleware);

export { prismaClient };
