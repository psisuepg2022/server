type keys =
  | "PORT"
  | "PASSWORD_HASH_SALT"
  | "SUPPORT_ID"
  | "LIST_ALLOWED_ORIGINS"
  | "JWT_SECRET_KEY"
  | "JWT_SECRET_KEY_REFRESH"
  | "BASE_URL";

const env = (key: keys): string | undefined => {
  if (!key) return undefined;
  return process.env[key];
};

export { env };
