import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { CreateAddressRequestModel } from "@models/dto/person/CreateAddressRequestModel";
import { CreateProfessionalRequestModel } from "@models/dto/professional/CreateProfessionalRequestModel";
import { IDateProvider } from "@providers/date";
import { IHashProvider } from "@providers/hash";
import { IMaskProvider } from "@providers/mask";
import { IPasswordProvider } from "@providers/password";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IAddressRepository } from "@repositories/address";
import { IAuthenticationRepository } from "@repositories/authentication";
import { IClinicRepository } from "@repositories/clinic";
import { IPersonRepository } from "@repositories/person";
import { IProfessionalRepository } from "@repositories/professional";
import { IScheduleRepository } from "@repositories/schedule";
import { IUserRepository } from "@repositories/user";

import { CreateProfessionalService } from "./CreateProfessionalService";

@injectable()
class UpdateProfessionalService extends CreateProfessionalService {
  constructor(
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ValidatorsProvider")
    validatorsProvider: IValidatorsProvider,
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("ClinicRepository")
    clinicRepository: IClinicRepository,
    @inject("PasswordProvider")
    passwordProvider: IPasswordProvider,
    @inject("UserRepository")
    userRepository: IUserRepository,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("HashProvider")
    hashProvider: IHashProvider,
    @inject("AuthenticationRepository")
    authenticationRepository: IAuthenticationRepository,
    @inject("AddressRepository")
    addressRepository: IAddressRepository,
    @inject("ProfessionalRepository")
    professionalRepository: IProfessionalRepository,
    @inject("ScheduleRepository")
    scheduleRepository: IScheduleRepository,
    @inject("DateProvider")
    dateProvider: IDateProvider
  ) {
    super(
      uniqueIdentifierProvider,
      validatorsProvider,
      personRepository,
      clinicRepository,
      passwordProvider,
      userRepository,
      maskProvider,
      hashProvider,
      authenticationRepository,
      addressRepository,
      professionalRepository,
      scheduleRepository,
      dateProvider
    );
  }

  public async execute({
    id,
    CPF,
    birthDate,
    name,
    address,
    userName,
    contactNumber,
    email,
    clinicId,
    profession,
    registry,
    specialization,
  }: CreateProfessionalRequestModel): Promise<Partial<ProfessionalModel>> {
    if (!id || stringIsNullOrEmpty(id))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["profissional"])
      );

    if (!this.uniqueIdentifierProvider.isValid(id))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const [hasProfessional] = await transaction([
      this.professionalRepository.getToUpdate(clinicId, id),
    ]);

    if (!hasProfessional)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDNotFound", ["paciente"])
      );

    const addressToSave = ((): CreateAddressRequestModel | undefined => {
      if (address) {
        if (
          !hasProfessional.user.person.address?.id ||
          stringIsNullOrEmpty(hasProfessional.user.person.address?.id as string)
        )
          return {
            ...address,
            id: this.uniqueIdentifierProvider.generate(),
          };

        if (address.id !== hasProfessional.user.person.address.id)
          throw new AppError(
            "BAD_REQUEST",
            i18n.__("ErrorUpdateAddressOtherId")
          );

        return {
          ...address,
          id: hasProfessional.user.person.address?.id,
        };
      }

      return undefined;
    })();

    const updated = await super.execute(
      {
        id,
        clinicId,
        email,
        contactNumber,
        CPF: CPF || hasProfessional.user.person.CPF || "",
        birthDate: `${
          birthDate ||
          hasProfessional.user.person.birthDate?.toISOString().split("T")[0]
        }`,
        name: name || hasProfessional.user.person.name || "",
        address: addressToSave,
        profession: profession || hasProfessional.profession || "",
        registry: registry || hasProfessional.registry || "",
        userName: userName || hasProfessional.user.userName || "",
        specialization: specialization || hasProfessional.specialization,
        password: "null",
      },
      false,
      false
    );

    return updated;
  }
}

export { UpdateProfessionalService };
