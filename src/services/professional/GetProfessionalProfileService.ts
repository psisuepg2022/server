import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { AddressModel } from "@models/domain/AddressModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { GetProfessionalProfileModel } from "@models/dto/professional/GetProfessionalProfileModel";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IProfessionalRepository } from "@repositories/professional";
import { GetUserProfileService } from "@services/user";

@injectable()
class GetProfessionalProfileService extends GetUserProfileService<
  GetProfessionalProfileModel,
  {
    person: Partial<PersonModel> & { address: AddressModel };
    professional: Partial<ProfessionalModel>;
  }
> {
  constructor(
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("ProfessionalRepository")
    private professionalRepository: IProfessionalRepository
  ) {
    super(uniqueIdentifierProvider, maskProvider);
  }

  protected getDomainClass = (): string => UserDomainClasses.PROFESSIONAL;

  protected getOperation = (
    clinicId: string,
    userId: string,
    domainClass: string
  ): any =>
    this.professionalRepository.getProfile(clinicId, userId, domainClass);

  protected convertObject = (obj: {
    person: Partial<PersonModel> & { address: AddressModel };
    professional: Partial<ProfessionalModel>;
  }): GetProfessionalProfileModel =>
    ({
      ...this.covertBase(obj),
      specialization: obj.professional.specialization,
      profession: obj.professional.profession,
      registry: obj.professional.registry,
    } as GetProfessionalProfileModel);
}

export { GetProfessionalProfileService };
