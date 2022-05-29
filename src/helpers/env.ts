type keys = "PORT" | "PAGE_SIZE_DEFAULT";

const env = (key: keys): string | undefined => {
  if (!key) return undefined;
  return process.env[key];
};

export { env };
