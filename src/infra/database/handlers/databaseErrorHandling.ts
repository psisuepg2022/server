import i18n from "i18n";

import { HttpStatus } from "@infra/http";
import { logger } from "@infra/log";
import { Prisma } from "@prisma/client";

import { CheckConstraintKeys } from "../utils/CheckConstraintKeys";
import { TriggerKeys } from "../utils/TriggerKeys";

const databaseErrorHandling = (err: unknown): [number, string] | null => {
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    const checkConstraintMatchArray = [
      ...err.message.matchAll(
        /(?:violates check constraint)\s(?:\\")((?:[a-z]|(?:_))+)(?:\\")/g
      ),
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

      return null;
    }

    const triggerRaiseExceptionMatchArray = [
      ...err.message.matchAll(
        /(?:\("PL\/pgSQL function)\s((?:[a-z]|(?:_|\(|\)))+)\s(?:line)\s(?:[0-9]+)\s(?:at RAISE"\))/g
      ),
    ];

    if (
      Array.isArray(triggerRaiseExceptionMatchArray) &&
      triggerRaiseExceptionMatchArray.length !== 0
    ) {
      const triggerExceptionMessageMatchArray = [
        ...err.message.matchAll(
          /(?:message:)\s(?:")((?:TRIGGER_RAISE_EXCEPTION_|[0-9])+)(?:")/g
        ),
      ];

      if (
        Array.isArray(triggerExceptionMessageMatchArray) &&
        triggerExceptionMessageMatchArray.length !== 0
      )
        return [
          HttpStatus.BAD_REQUEST,
          i18n.__(
            TriggerKeys[
              triggerExceptionMessageMatchArray[0][1] as keyof typeof TriggerKeys
            ]
          ),
        ];

      logger.error(
        `Database trigger raise exception without handling: ${err.message}`
      );

      return null;
    }

    logger.error(`Database error without handling: ${err}`);
  }

  return null;
};

export { databaseErrorHandling };
