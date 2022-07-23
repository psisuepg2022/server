import i18n, { __ } from "i18n";
import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { toNumber } from "@helpers/toNumber";
import { transaction } from "@infra/database/transaction";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { CreateProfessionalRequestModel } from "@models/dto/professional/CreateProfessionalRequestModel";
import { PrismaPromise } from "@prisma/client";
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
import { IUserRepository } from "@repositories/user";
import { CreateUserService } from "@services/user";

@injectable()
class CreateProfessionalService extends CreateUserService {
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
    haskProvider: IHashProvider,
    @inject("AuthenticationRepository")
    authenticationRepository: IAuthenticationRepository,
    @inject("AddressRepository")
    addressRepository: IAddressRepository,
    @inject("ProfessionalRepository")
    private professionalRepository: IProfessionalRepository
  ) {
    super(
      validatorsProvider,
      personRepository,
      clinicRepository,
      maskProvider,
      uniqueIdentifierProvider,
      addressRepository,
      userRepository,
      passwordProvider,
      haskProvider,
      authenticationRepository
    );
  }

  public async execute({
    CPF,
    birthDate,
    name,
    address,
    password,
    userName,
    contactNumber,
    email,
    clinicId,
    baseDuration,
    profession,
    registry,
    specialization,
  }: CreateProfessionalRequestModel): Promise<Partial<ProfessionalModel>> {
    const id = this.uniqueIdentifierProvider.generate();

    if (stringIsNullOrEmpty(profession))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorProfessionRequired"));

    if (stringIsNullOrEmpty(registry))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorRegistryRequired"));

    if (stringIsNullOrEmpty(baseDuration))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorBaseDurationRequired"));

    const baseDurationConverted = toNumber({
      value: baseDuration,
      error: new AppError("BAD_REQUEST", i18n.__("ErrorBaseDurationInvalid")),
    });

    await super.createUserOperation(
      {
        birthDate,
        CPF,
        name,
        address,
        contactNumber,
        email,
        password,
        userName,
        clinicId,
      },
      id,
      UserDomainClasses.PROFESSIONAL
    );

    const createProfessionalOperation = this.professionalRepository.save(id, {
      baseDuration: baseDurationConverted,
      profession,
      registry,
      specialization,
    } as ProfessionalModel);

    const [person, user, professional, addressSaved] = await transaction(
      ((): PrismaPromise<any>[] =>
        address
          ? [
              this.getCreatePersonOperation(),
              this.getCreateUserOperation(),
              createProfessionalOperation,
              this.getAddressOperation(),
            ]
          : [
              this.getCreatePersonOperation(),
              this.getCreateUserOperation(),
              createProfessionalOperation,
            ])()
    );

    return {
      ...user,
      ...person,
      ...professional,
      address: {
        ...addressSaved,
        zipCode: this.maskProvider.zipCode(address?.zipCode || ""),
      },
      CPF: this.maskProvider.cpf(person.CPF),
      birthDate: this.maskProvider.date(person.birthDate),
      contactNumber: this.maskProvider.contactNumber(person.contactNumber),
    } as Partial<ProfessionalModel>;
  }
}

export { CreateProfessionalService };
