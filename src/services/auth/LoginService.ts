import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { toNumber } from "@helpers/toNumber";
import { transaction } from "@infra/database/transaction";
import { LoginRequestModel } from "@models/dto/auth/LoginRequestModel";
import { LoginResponseModel } from "@models/dto/auth/LoginResponseModel";
import { IHashProvider } from "@providers/hash";
import { IUserRepository } from "@repositories/user";

@injectable()
class LoginService {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("HashProvider")
    private hashProvider: IHashProvider
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

    if (!(await this.hashProvider.compare(password, hasUser.password)))
      throw new AppError("UNAUTHORIZED", i18n.__("ErrorLoginUserUnauthorized"));

    return {} as LoginResponseModel;
  }
}

export { LoginService };
