import { i18n } from "@config/i18n";
import { AppError } from "@handlers/error/AppError";
import { IPaginationOptions } from "@infra/http";

import { env } from "./env";

const pagination = ({ size, page }: IPaginationOptions): [number, number] => {
  const take = ((): number => {
    if (size) {
      const converted = Number(size);
      if (Number.isNaN(converted))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorQueryTypecasting"));

      return converted;
    }

    const sizeDefault = Number(env("PAGE_SIZE_DEFAULT"));
    if (!sizeDefault || Number.isNaN(sizeDefault))
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        i18n.__("ErrorEnvPageSizeDefault")
      );

    return sizeDefault;
  })();

  const skip = ((): number => {
    if (page) {
      const converted = Number(page);
      if (Number.isNaN(converted))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorQueryTypecasting"));
      return converted * take;
    }

    return 0;
  })();

  return [take, skip];
};

export { pagination };
