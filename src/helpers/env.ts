type keys = "PORT" | "PAGE_SIZE_DEFAULT" | "PASSWORD_HASH_SALT" | "SUPPORT_ID";

const env = (key: keys): string | undefined => {
  if (!key) return undefined;
  return process.env[key];
};

export { env };
