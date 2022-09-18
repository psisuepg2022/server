import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { GetUserProfileRequestModel } from "@models/dto/user/GetUserProfileRequestModel";
import { GetUserProfileResponseModel } from "@models/dto/user/GetUserProfileResponseModel";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IUserRepository } from "@repositories/user";

@injectable()
class GetUserProfileService<
  T extends GetUserProfileResponseModel = GetUserProfileResponseModel
> {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider
  ) {}

  public async execute({
    clinicId,
    userId,
  }: GetUserProfileRequestModel): Promise<T> {
    if (stringIsNullOrEmpty(userId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["usuário"])
      );

    if (!this.uniqueIdentifierProvider.isValid(userId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const [profile] = await transaction([
      this.userRepository.getProfile(clinicId, userId),
    ]);

    if (!profile)
      throw new AppError("NOT_FOUND", i18n.__("ErrorGetProfileNotFound"));

    return {
      id: profile.person.id,
      name: profile.person.name,
      CPF: this.maskProvider.cpf(profile.person.CPF || ""),
      email: profile.person.email,
      birthDate: this.maskProvider.date(profile.person.birthDate as Date),
      address: {
        id: profile.person.address.id,
        city: profile.person.address.city,
        publicArea: profile.person.address.publicArea,
        state: profile.person.address.state,
        district: profile.person.address.district,
        zipCode: this.maskProvider.zipCode(profile.person.address.zipCode),
      },
    } as T;
  }
}

export { GetUserProfileService };
