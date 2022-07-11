import i18n from "i18n";

import { Domains } from "@infra/utils";

const getEnumDescription = (
  domain: keyof typeof Domains,
  key: string
): string => i18n.__(`Domain${Domains[domain]}_${key}`);

export { getEnumDescription };
