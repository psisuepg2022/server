import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { AppError } from "@handlers/error/AppError";
import { env } from "@helpers/env";
import { getUserType2External } from "@helpers/getUserType2External";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { toNumber } from "@helpers/toNumber";
import { transaction } from "@infra/database/transaction";
import { LoginRequestModel } from "@models/dto/auth/LoginRequestModel";
import { LoginResponseModel } from "@models/dto/auth/LoginResponseModel";
import { AuthTokenPayloadModel } from "@models/utils/AuthTokenPayloadModel";
import { PermissionModel } from "@models/utils/PermissionModel";
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
      error: new AppError("BAD_REQUEST", i18n.__("ErrorLoginUserUnauthorized")),
    });

    const [hasUser] = await transaction([
      this.userRepository.hasActivatedUser(userName, accessCodeConverted),
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

    await transaction([
      this.userRepository.updateLoginControlProps(hasUser.id, 0, false),
    ]);

    const baseDuration = ((): number | undefined => {
      if (
        !stringIsNullOrEmpty(hasUser.person.domainClass) &&
        hasUser.person.domainClass === UserDomainClasses.PROFESSIONAL
      )
        return hasUser.professional?.baseDuration;

      return undefined;
    })();

    const accessToken = this.authTokenProvider.generate({
      id: hasUser.id,
      baseDuration,
      name: hasUser.person.name,
      clinic: hasUser.person.clinic,
      permissions: [
        ...hasUser.role.permissions?.map(
          ({ name }: Partial<PermissionModel>): string => name || "ERROR"
        ),
        getUserType2External(hasUser.role.name),
      ],
      type: "access_token",
    } as AuthTokenPayloadModel);

    const refreshToken = this.authTokenProvider.generate({
      id: hasUser.id,
      type: "refresh_token",
    } as AuthTokenPayloadModel);

    return {
      accessToken,
      refreshToken,
    };
  }
}

export { LoginService };
