import i18n from "i18n";
import path from "path";

import { AppError } from "@handlers/error/AppError";
import { Languages } from "@infra/utils";

i18n.configure({
  locales: Object.values(Languages),
  defaultLocale: Languages.PORTUGUESE,
  updateFiles: false,
  header: "language",
  queryParameter: "lang",
  extension: ".json",
  directory: path.join(
    __dirname,
    "..",
    "..",
    "handlers",
    "error",
    "i18n_translations"
  ),
  api: {
    __: "translate",
    __n: "translateN",
  },
  missingKeyFn(locale, value) {
    const message = ((): string => {
      switch (locale) {
        case Languages.ENGLISH:
          return "Internal server error.";
        case Languages.PORTUGUESE:
          return "Ocorreu um erro interno no servidor";
        default:
          return "";
      }
    })();

    console.log(`Missing key: ${value} for ${locale} language`);

    throw new AppError(500, message);
  },
});

export { i18n };
