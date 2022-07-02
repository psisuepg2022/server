import { i18n } from "@config/i18n";
import { AppError } from "@handlers/error/AppError";
import { IPaginationOptions } from "@infra/http";

import { env } from "./env";
import { toNumber } from "./toNumber";

const pagination = ({ size, page }: IPaginationOptions): [number, number] => {
  const take = ((): number => {
    if (size) {
      const converted = toNumber({
        value: size,
        error: new AppError("BAD_REQUEST", i18n.__("ErrorQueryTypecasting")),
      });

      return converted;
    }

    const sizeDefault = toNumber({
      value: env("PAGE_SIZE_DEFAULT"),
      error: new AppError(
        "INTERNAL_SERVER_ERROR",
        i18n.__("ErrorEnvPageSizeDefault")
      ),
    });

    return sizeDefault;
  })();

  const skip = ((): number => {
    if (page) {
      const converted = toNumber({
        value: page,
        error: new AppError("BAD_REQUEST", i18n.__("ErrorQueryTypecasting")),
      });
      return converted * take;
    }

    return 0;
  })();

  return [take, skip];
};

export { pagination };
