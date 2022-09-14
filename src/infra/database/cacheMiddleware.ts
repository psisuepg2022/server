import { createPrismaRedisCache } from "prisma-redis-middleware";

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

export { cacheMiddleware };
