import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { env } from "@helpers/env";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { toNumber } from "@helpers/toNumber";
import { transaction } from "@infra/database/transaction";
import { LoginRequestModel } from "@models/dto/auth/LoginRequestModel";
import { LoginResponseModel } from "@models/dto/auth/LoginResponseModel";
import { AuthTokenPayloadModel } from "@models/utils/AuthTokenPayloadModel";
import { IAuthTokenProvider } from "@providers/authToken";
import { IHashProvider } from "@providers/hash";
import { IUserRepository } from "@repositories/user";

@injectable()
class LoginService {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("HashProvider")
    private hashProvider: IHashProvider,
    @inject("AuthTokenProvider")
    private authTokenProvider: IAuthTokenProvider
  ) {}

  public async execute({
    accessCode,
    password,
    userName,
  }: LoginRequestModel): Promise<LoginResponseModel> {
    if (stringIsNullOrEmpty(accessCode))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorAccessCodeRequired"));

    if (stringIsNullOrEmpty(userName))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUserNameRequired"));

    if (stringIsNullOrEmpty(password))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorPasswordRequired"));

    const accessCodeConverted = toNumber({
      value: accessCode,
      error: new AppError("BAD_REQUEST", i18n.__("ErrorAccessCodeInvalid")),
    });

    const [hasUser] = await transaction([
      this.userRepository.hasUser(userName, accessCodeConverted),
    ]);

    if (!hasUser)
      throw new AppError("UNAUTHORIZED", i18n.__("ErrorLoginUserUnauthorized"));

    if (hasUser.blocked)
      throw new AppError("UNAUTHORIZED", i18n.__("ErrorUserIsBlocked"));

    if (!(await this.hashProvider.compare(password, hasUser.password))) {
      const maxLoginAttempts = env("MAX_LOGIN_ATTEMPTS");

      if (stringIsNullOrEmpty(maxLoginAttempts || ""))
        throw new AppError(
          "INTERNAL_SERVER_ERROR",
          i18n.__("ErrorEnvMaxLoginAttempts")
        );

      const max = toNumber({
        value: maxLoginAttempts,
        error: new AppError(
          "INTERNAL_SERVER_ERROR",
          i18n.__("ErrorEnvMaxLoginAttempts")
        ),
      });

      const [userUpdated] = await transaction([
        this.userRepository.updateLoginControlProps(
          hasUser.id,
          hasUser.loginAttempts + 1,
          hasUser.loginAttempts + 1 === max
        ),
      ]);

      if (userUpdated.blocked)
        throw new AppError(
          "UNAUTHORIZED",
          i18n.__("ErrorLoginUserWillBeBlocked")
        );

      throw new AppError("UNAUTHORIZED", i18n.__("ErrorLoginUserUnauthorized"));
    }

    const payload: Partial<AuthTokenPayloadModel> = {
      id: hasUser.id,
      name: hasUser.person.name,
      email: hasUser.person.email,
      accessCode: hasUser.accessCode,
      userName: hasUser.userName,
      clinic: {
        id: hasUser.person.clinic.id,
        name: hasUser.person.clinic.name,
      },
    };

    const accessToken = this.authTokenProvider.generate({
      ...payload,
      type: "access_token",
    } as AuthTokenPayloadModel);

    const refreshToken = this.authTokenProvider.generate({
      ...payload,
      type: "refresh_token",
    } as AuthTokenPayloadModel);

    return {
      accessToken,
      refreshToken,
    };
  }
}

export { LoginService };
