type keys =
  | "PORT"
  | "PAGE_SIZE_DEFAULT"
  | "MAX_PAGE_SIZE"
  | "PASSWORD_HASH_SALT"
  | "SUPPORT_ID"
  | "LIST_ALLOWED_ORIGINS";

const env = (key: keys): string | undefined => {
  if (!key) return undefined;
  return process.env[key];
};

export { env };
