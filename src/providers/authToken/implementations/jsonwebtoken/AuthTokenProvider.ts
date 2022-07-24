import i18n from "i18n";
import { sign, decode as jwtDecode, verify as jwtVerify } from "jsonwebtoken";

import { AppError } from "@handlers/error/AppError";
import { env } from "@helpers/env";
import { IAuthTokenProvider } from "@providers/authToken/models/IAuthTokenProvider";

class AuthTokenProvider implements IAuthTokenProvider {
  private readonly secret: string;

  constructor() {
    const key = env("JWT_SECRET_KEY");

    if (!key)
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        i18n.__("ErrorEnvJwtSecretKey")
      );

    this.secret = key;
  }

  public generate = (payload: any): string =>
    sign(payload, this.secret, {
      expiresIn: "",
    });

  public decode = (token: string): any => jwtDecode(token);

  public verify = (token: string): boolean => !!jwtVerify(token, this.secret);
}

export { AuthTokenProvider };
