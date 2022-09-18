import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { GetUserProfileResponseModel } from "@models/dto/user/GetUserProfileResponseModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";

@injectable()
class GetUserProfileService<
  T extends GetUserProfileResponseModel = GetUserProfileResponseModel
> {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider
  ) {}

  public async execute(id: string): Promise<T> {
    if (stringIsNullOrEmpty(id))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["usuário"])
      );

    if (!this.uniqueIdentifierProvider.isValid(id))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    return {} as T;
  }
}

export { GetUserProfileService };
