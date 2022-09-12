import { logger } from "@infra/log";
import { PrismaClient } from "@prisma/client";

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

export { prismaClient };
