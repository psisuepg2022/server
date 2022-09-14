import { createPrismaRedisCache } from "prisma-redis-middleware";

import { logger } from "@infra/log";
import { PrismaClient, Prisma } from "@prisma/client";

const prismaClient = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
  ],
});

prismaClient.$on("query", (evt) => {
  const params = JSON.parse(evt.params);

  const matchArray: string[] = [...evt.query.matchAll(/(?:\$)[0-9]+/g)].map(
    ([item]: RegExpMatchArray): string => item
  );

  const log = matchArray.reduce(
    (acc: string, item: string, index: number): string =>
      acc.replace(
        item,
        typeof params[index] === "string" ? `'${params[index]}'` : params[index]
      ),
    evt.query
  );

  logger.info(log);
});

prismaClient.$on("error", (evt) => logger.error(evt.message));

const cacheMiddleware: Prisma.Middleware<any> = createPrismaRedisCache({
  models: [
    { model: "Appointment", excludeMethods: ["findFirst"] },
    { model: "Person", excludeMethods: ["findFirst"] },
    { model: "User", excludeMethods: ["findFirst"] },
    { model: "Patient", excludeMethods: ["findFirst"] },
    { model: "Professional", excludeMethods: ["findFirst"] },
    { model: "Clinic", excludeMethods: ["findFirst"] },
    { model: "WeeklySchedule", excludeMethods: ["findFirst"] },
    { model: "WeeklyScheduleLock", excludeMethods: ["findFirst"] },
    { model: "ScheduleLock", excludeMethods: ["findFirst"] },
    { model: "Liable", excludeMethods: ["findFirst"] },
  ],
  storage: {
    type: "memory",
    options: {
      invalidation: true,
      // log: "console",
    },
  },
  cacheTime: 1,
  // onHit: (key) => console.log("hit", key),
  // onMiss: (key) => console.log("miss", key),
  // onError: (key) => console.log("error", key),
}) as Prisma.Middleware<any>;

prismaClient.$use(cacheMiddleware);

export { prismaClient };
