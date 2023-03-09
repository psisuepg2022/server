import { ReplaceAllInput } from "@models/utils/ReplaceAllInput";

const replaceAll = ({
  caseSensitive,
  find,
  replace,
  str,
}: ReplaceAllInput): string =>
  str.replace(new RegExp(find, caseSensitive ? "ig" : "g"), replace);

export { replaceAll };
