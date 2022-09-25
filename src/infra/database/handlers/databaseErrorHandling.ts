import i18n from "i18n";

import { HttpStatus } from "@infra/http";
import { logger } from "@infra/log";
import { Prisma } from "@prisma/client";

import { CheckConstraintKeys } from "../utils/CheckConstraintKeys";

const databaseErrorHandling = (err: unknown): [number, string] | null => {
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    const checkConstraintPattern =
      /(?:violates check constraint)\s(?:\\")((?:[a-z]|(?:_))+)(?:\\")/g;

    const checkConstraintMatchArray = [
      ...err.message.matchAll(checkConstraintPattern),
    ];

    if (
      Array.isArray(checkConstraintMatchArray) &&
      checkConstraintMatchArray.length !== 0
    ) {
      const checkConstraintKey = checkConstraintMatchArray[0][1];

      if (checkConstraintKey in CheckConstraintKeys)
        return [
          HttpStatus.BAD_REQUEST,
          i18n.__(
            CheckConstraintKeys[
              checkConstraintKey as keyof typeof CheckConstraintKeys
            ]
          ),
        ];

      logger.error(
        `Database check constraint missing key: ${checkConstraintKey}`
      );
    }
  }

  return null;
};

export { databaseErrorHandling };
