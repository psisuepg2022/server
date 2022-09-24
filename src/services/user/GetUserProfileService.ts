import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { AddressModel } from "@models/domain/AddressModel";
import { PersonModel } from "@models/domain/PersonModel";
import { GetUserProfileRequestModel } from "@models/dto/user/GetUserProfileRequestModel";
import { GetUserProfileResponseModel } from "@models/dto/user/GetUserProfileResponseModel";
import { PrismaPromise } from "@prisma/client";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";

@injectable()
class GetUserProfileService<
  T extends GetUserProfileResponseModel = GetUserProfileResponseModel,
  K extends {
    person: Partial<PersonModel> & { address: AddressModel };
  } = {
    person: Partial<PersonModel> & { address: AddressModel };
  }
> {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider
  ) {}

  protected getDomainClass = (): string => {
    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      i18n.__("ErrorWithoutHandling")
    );
  };

  protected getOperation = (
    _: string,
    __: string,
    ___: string
  ): PrismaPromise<K> => {
    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      i18n.__("ErrorWithoutHandling")
    );
  };

  protected convertObject = (_: K): T => {
    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      i18n.__("ErrorWithoutHandling")
    );
  };

  protected covertBase = ({
    person,
  }: {
    person: Partial<PersonModel> & { address: AddressModel };
  }): GetUserProfileResponseModel => ({
    id: person.id || "",
    name: person.name || "",
    CPF: this.maskProvider.cpf(person.CPF || ""),
    email: person.email || "",
    birthDate: this.maskProvider.date(person.birthDate as Date),
    contactNumber: this.maskProvider.contactNumber(person.contactNumber || ""),
    address: {
      id: person.address.id,
      city: person.address.city,
      publicArea: person.address.publicArea,
      state: person.address.state,
      district: person.address.district,
      zipCode: this.maskProvider.zipCode(person.address.zipCode),
    },
  });

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
      this.getOperation(clinicId, userId, this.getDomainClass()),
    ]);

    if (!profile)
      throw new AppError("NOT_FOUND", i18n.__("ErrorGetProfileNotFound"));

    return this.convertObject(profile);
  }
}

export { GetUserProfileService };
