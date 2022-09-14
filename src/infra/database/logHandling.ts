import { logger } from "@infra/log";
import { Prisma } from "@prisma/client";

const handleErrorLog = (evt: Prisma.LogEvent): void => {
  logger.error(evt.message);
};

const handleQueryLog = (evt: Prisma.QueryEvent): void => {
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
};

export { handleQueryLog, handleErrorLog };
