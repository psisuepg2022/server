import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { LoginResponseModel } from "@models/dto/auth/LoginResponseModel";
import { AuthTokenPayloadModel } from "@models/utils/AuthTokenPayloadModel";
import { IAuthTokenProvider } from "@providers/authToken";

@injectable()
class RefreshTokenService {
  constructor(
    @inject("AuthTokenProvider")
    private authTokenProvider: IAuthTokenProvider
  ) {}

  public async execute(refreshToken: string): Promise<LoginResponseModel> {
    if (stringIsNullOrEmpty(refreshToken))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorRefreshTokenRequired"));

    const payload = this.authTokenProvider.decode(refreshToken);

    if (!payload || payload.type !== "refresh_token")
      throw new AppError("BAD_REQUEST", i18n.__("ErrorRefreshInvalid"));

    if (payload.exp && Date.now() >= payload.exp * 1000)
      throw new AppError("BAD_REQUEST", i18n.__("ErrorRefreshTokenExpired"));

    if (!this.authTokenProvider.verify(refreshToken))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorRefreshInvalid"));

    return {
      accessToken: this.authTokenProvider.generate({
        clinic: {
          id: "",
          name: "",
        },
        id: "",
        type: "access_token",
        permissions: [""],
      } as AuthTokenPayloadModel),
      refreshToken: this.authTokenProvider.generate({
        id: "",
        type: "refresh_token",
      } as AuthTokenPayloadModel),
    };
  }
}

export { RefreshTokenService };
