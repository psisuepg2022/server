import { createPrismaRedisCache } from "prisma-redis-middleware";

import { logger } from "@infra/log";
import { Prisma } from "@prisma/client";

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
    options: { invalidation: true },
  },
  cacheTime: 1,
  onHit: (key) => logger.info(`Prisma Cache Middleware -> hit ${key}`),
  onMiss: (key) => logger.info(`Prisma Cache Middleware -> miss ${key}`),
  onError: (key) => logger.info(`Prisma Cache Middleware -> error ${key}`),
}) as Prisma.Middleware<any>;

export { cacheMiddleware };
