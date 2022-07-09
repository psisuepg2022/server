import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { transaction } from "@infra/database/transaction";
import { EmployeeModel } from "@models/domain/EmployeeModel";
import { CreateEmployeeRequestModel } from "@models/dto/employee/CreateEmployeeRequestModel";
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
class CreateEmployeeService extends CreateUserService {
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
  }: CreateEmployeeRequestModel): Promise<Partial<EmployeeModel>> {
    const id = this.uniqueIdentifierProvider.generate();

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
      UserDomainClasses.EMPLOYEE
    );

    const [person, { password: __, ...user }, addressSaved] = await transaction(
      ((): PrismaPromise<any>[] =>
        address
          ? [
              this.getCreatePersonOperation(),
              this.getCreateUserOperation(),
              this.getAddressOperation(),
            ]
          : [this.getCreatePersonOperation(), this.getCreateUserOperation()])()
    );

    return {
      ...user,
      ...person,
      address: addressSaved,
      CPF: this.maskProvider.cpf(person.CPF),
      birthDate: this.maskProvider.date(person.birthDate),
      contactNumber: this.maskProvider.contactNumber(person.contactNumber),
    } as Partial<EmployeeModel>;
  }
}

export { CreateEmployeeService };
