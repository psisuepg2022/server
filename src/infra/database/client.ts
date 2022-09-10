import { createPrismaRedisCache } from "prisma-redis-middleware";

import { Prisma, PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

const cacheMiddleware: Prisma.Middleware<any> = createPrismaRedisCache({
  models: [
    { model: "Appointment", cacheTime: 300, excludeMethods: ["findFirst"] },
    { model: "Person", cacheTime: 300, excludeMethods: ["findFirst"] },
    { model: "User", cacheTime: 300, excludeMethods: ["findFirst"] },
    { model: "Patient", cacheTime: 300, excludeMethods: ["findFirst"] },
    { model: "Professional", cacheTime: 300, excludeMethods: ["findFirst"] },
    { model: "Clinic", cacheTime: 300, excludeMethods: ["findFirst"] },
    { model: "WeeklySchedule", cacheTime: 300, excludeMethods: ["findFirst"] },
    {
      model: "WeeklyScheduleLock",
      cacheTime: 300,
      excludeMethods: ["findFirst"],
    },
    { model: "ScheduleLock", cacheTime: 300, excludeMethods: ["findFirst"] },
    { model: "Liable", cacheTime: 300, excludeMethods: ["findFirst"] },
  ],
  storage: {
    type: "memory",
    options: {
      invalidation: true,
      // log: "console",
    },
  },
  cacheTime: 300,
  // onHit: (key) => console.log("hit", key),
  // onMiss: (key) => console.log("miss", key),
  // onError: (key) => console.log("error", key),
}) as Prisma.Middleware<any>;

prismaClient.$use(cacheMiddleware);

export { prismaClient };
