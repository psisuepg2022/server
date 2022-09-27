import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { EmployeeModel } from "@models/domain/EmployeeModel";
import { UpdateOwnerRequestModel } from "@models/dto/owner/UpdateOwnerRequestModel";
import { CreateAddressRequestModel } from "@models/dto/person/CreateAddressRequestModel";
import { IHashProvider } from "@providers/hash";
import { IMaskProvider } from "@providers/mask";
import { IPasswordProvider } from "@providers/password";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IAddressRepository } from "@repositories/address";
import { IAuthenticationRepository } from "@repositories/authentication";
import { IClinicRepository } from "@repositories/clinic";
import { IPersonRepository } from "@repositories/person";
import { IUserRepository } from "@repositories/user";

import { CreateOwnerService } from "./CreateOwnerService";

@injectable()
class UpdateOwnerService extends CreateOwnerService {
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
    addressRepository: IAddressRepository
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
      addressRepository
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
    clinic,
  }: UpdateOwnerRequestModel): Promise<Partial<EmployeeModel>> {
    if (!id || stringIsNullOrEmpty(id))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["proprietário"])
      );

    if (!this.uniqueIdentifierProvider.isValid(id))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const [hasEmployee] = await transaction([
      this.userRepository.getToUpdate(clinicId, id, UserDomainClasses.OWNER),
    ]);

    if (!hasEmployee)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDNotFound", ["proprietário"])
      );

    if (clinic) {
      if (stringIsNullOrEmpty(clinic.name))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorNameIsRequired"));

      if (stringIsNullOrEmpty(clinic.email))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorEmailIsRequired"));

      if (!this.validatorsProvider.email(clinic.email))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorEmailInvalid"));

      const [hasClinic] = await transaction([
        this.clinicRepository.hasEmail(clinicId, clinic.email),
      ]);

      if (hasClinic)
        throw new AppError(
          "BAD_REQUEST",
          i18n.__("ErrorClinicEmailAlreadyExists")
        );
    }

    const addressToSave = ((): CreateAddressRequestModel | undefined => {
      if (address) {
        if (
          !hasEmployee.person.address?.id ||
          stringIsNullOrEmpty(hasEmployee.person.address?.id as string)
        )
          return {
            ...address,
            id: this.uniqueIdentifierProvider.generate(),
          };

        if (address.id !== hasEmployee.person.address.id)
          throw new AppError(
            "BAD_REQUEST",
            i18n.__("ErrorUpdateAddressOtherId")
          );

        return {
          ...address,
          id: hasEmployee.person.address?.id,
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
        CPF: CPF || hasEmployee.person.CPF || "",
        birthDate: `${
          birthDate || hasEmployee.person.birthDate?.toISOString().split("T")[0]
        }`,
        name: name || hasEmployee.person.name || "",
        address: addressToSave,
        userName: userName || hasEmployee.userName || "",
        password: "null",
      },
      false,
      clinic
    );

    return updated;
  }
}

export { UpdateOwnerService };
