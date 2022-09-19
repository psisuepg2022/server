import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { AppError } from "@handlers/error/AppError";
import { getUserType2External } from "@helpers/getUserType2External";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { LoginResponseModel } from "@models/dto/auth/LoginResponseModel";
import { AuthTokenPayloadModel } from "@models/utils/AuthTokenPayloadModel";
import { PermissionModel } from "@models/utils/PermissionModel";
import { IAuthTokenProvider } from "@providers/authToken";
import { IAuthenticationRepository } from "@repositories/authentication";

@injectable()
class RefreshTokenService {
  constructor(
    @inject("AuthTokenProvider")
    private authTokenProvider: IAuthTokenProvider,
    @inject("AuthenticationRepository")
    private authenticationRepository: IAuthenticationRepository
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

    const [hasUser] = await transaction([
      this.authenticationRepository.getUserToRefreshToken(payload.id),
    ]);

    if (!hasUser)
      throw new AppError("NOT_FOUND", i18n.__("ErrorRefreshUserNotFound"));

    const baseDuration = ((): number | undefined => {
      if (
        !stringIsNullOrEmpty(hasUser.person.domainClass || "") &&
        hasUser.person.domainClass === UserDomainClasses.PROFESSIONAL
      )
        return hasUser.professional?.baseDuration;

      return undefined;
    })();

    return {
      accessToken: this.authTokenProvider.generate({
        id: hasUser.id,
        baseDuration,
        clinic: {
          id: hasUser.person.clinic.id,
          name: hasUser.person.clinic.name,
        },
        permissions: [
          ...hasUser.role.permissions?.map(
            ({ name }: Partial<PermissionModel>): string => name || "ERROR"
          ),
          getUserType2External(hasUser.person.domainClass || ""),
        ],
        type: "access_token",
      } as AuthTokenPayloadModel),
      refreshToken: this.authTokenProvider.generate({
        id: hasUser.id,
        type: "refresh_token",
      } as AuthTokenPayloadModel),
    };
  }
}

export { RefreshTokenService };
