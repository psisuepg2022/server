import i18n from "i18n";
import { sign, decode as jwtDecode, verify as jwtVerify } from "jsonwebtoken";

import { AppError } from "@handlers/error/AppError";
import { env } from "@helpers/env";
import { AuthTokenPayloadModel } from "@models/utils/AuthTokenPayloadModel";
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

  public generate = ({ type, ...rest }: AuthTokenPayloadModel): string =>
    sign({ type, ...rest }, this.secret, {
      expiresIn: type === "access_token" ? "3d" : "15d",
    });

  public decode = (token: string): AuthTokenPayloadModel =>
    jwtDecode(token) as AuthTokenPayloadModel;

  public verify = (token: string): boolean => !!jwtVerify(token, this.secret);
}

export { AuthTokenProvider };
