import { inject, injectable } from "tsyringe";

import { RolesKeys } from "@common/RolesKeys";
import { transaction } from "@infra/database/transaction";
import { OwnerModel } from "@models/domain/OwnerModel";
import { CreateClinicRequestModel } from "@models/dto/clinic/CreateClinicRequestModel";
import { CreateOwnerRequestModel } from "@models/dto/owner/CreateOwnerRequestModel";
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
import { IUserRepository } from "@repositories/user";
import { CreateUserService } from "@services/user";

@injectable()
class CreateOwnerService extends CreateUserService {
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
    addressRepository: IAddressRepository
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

  public async execute(
    {
      id: idReceived,
      CPF,
      birthDate,
      name,
      address,
      password,
      userName,
      contactNumber,
      email,
      clinicId,
    }: CreateOwnerRequestModel,
    savePassword = true,
    clinic?: CreateClinicRequestModel
  ): Promise<Partial<OwnerModel> & { accessCode: number }> {
    const id = this.getObjectId(idReceived);

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
      RolesKeys.OWNER,
      savePassword
    );

    const [person, { person: accessCode, ...user }, ...optional] =
      await transaction(
        ((): PrismaPromise<any>[] => {
          const operations = [
            this.getCreatePersonOperation(),
            this.getCreateUserOperation(),
          ];

          if (address) operations.push(this.getAddressOperation());

          if (clinic)
            operations.push(
              this.clinicRepository.save({
                id: clinicId,
                email: clinic.email,
                name: clinic.name,
              })
            );

          return operations;
        })()
      );

    const [addressIndex, clinicIndex] = ((): [number, number] => [
      address ? 0 : -1,
      clinic ? (address ? 1 : 0) : -1,
    ])();

    return {
      ...user,
      ...person,
      accessCode: accessCode.clinic.code,
      address:
        addressIndex !== -1
          ? {
              ...optional[addressIndex],
              zipCode: this.maskProvider.zipCode(address?.zipCode || ""),
            }
          : undefined,
      clinic:
        clinicIndex !== -1
          ? {
              name: optional[clinicIndex].name,
              email: optional[clinicIndex].email,
            }
          : undefined,
      CPF: this.maskProvider.cpf(person.CPF),
      birthDate: this.maskProvider.date(person.birthDate),
      email: person.email || undefined,
      contactNumber: person.contactNumber
        ? this.maskProvider.contactNumber(person.contactNumber)
        : undefined,
    };
  }
}

export { CreateOwnerService };
