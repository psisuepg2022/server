import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { AddressModel } from "@models/domain/AddressModel";
import { PersonModel } from "@models/domain/PersonModel";
import { GetUserProfileResponseModel } from "@models/dto/user/GetUserProfileResponseModel";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IUserRepository } from "@repositories/user";
import { GetUserProfileService } from "@services/user";

@injectable()
class GetOwnerProfileService extends GetUserProfileService {
  constructor(
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {
    super(uniqueIdentifierProvider, maskProvider);
  }

  protected getDomainClass = (): string => UserDomainClasses.OWNER;

  protected getOperation = (
    clinicId: string,
    userId: string,
    domainClass: string
  ): any => this.userRepository.getProfile(clinicId, userId, domainClass);

  protected convertObject = (obj: {
    userName: string;
    person: Partial<PersonModel> & { address: AddressModel };
  }): GetUserProfileResponseModel =>
    ({ ...this.covertBase(obj) } as GetUserProfileResponseModel);
}

export { GetOwnerProfileService };
