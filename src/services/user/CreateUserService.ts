import i18n from "i18n";

import { RolesKeys } from "@common/RolesKeys";
import { UserDomainClasses } from "@common/UserDomainClasses";
import { AppError } from "@handlers/error/AppError";
import { env } from "@helpers/env";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { toNumber } from "@helpers/toNumber";
import { transaction } from "@infra/database/transaction";
import { UserModel } from "@models/domain/UserModel";
import { CreateUserRequestModel } from "@models/dto/user/CreateUserRequestModel";
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
import { CreatePersonService } from "@services/person";

class CreateUserService extends CreatePersonService {
  private userOperation?: PrismaPromise<Partial<UserModel>>;

  constructor(
    validatorsProvider: IValidatorsProvider,
    personRepository: IPersonRepository,
    clinicRepository: IClinicRepository,
    maskProvider: IMaskProvider,
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    addressRepository: IAddressRepository,
    protected userRepository: IUserRepository,
    protected passwordProvider: IPasswordProvider,
    protected hashProvider: IHashProvider,
    protected authenticationRepository: IAuthenticationRepository
  ) {
    super(
      validatorsProvider,
      personRepository,
      clinicRepository,
      maskProvider,
      uniqueIdentifierProvider,
      addressRepository
    );
  }

  protected getCreateUserOperation = (): PrismaPromise<Partial<UserModel>> => {
    if (this.userOperation) return this.userOperation;

    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      i18n.__("ErrorBaseCreateOperationFailed")
    );
  };

  private getDomainClass = (role: string): string => {
    switch (role) {
      case RolesKeys.EMPLOYEE:
        return UserDomainClasses.EMPLOYEE;
      case RolesKeys.OWNER:
        return UserDomainClasses.OWNER;
      case RolesKeys.PROFESSIONAL:
      case RolesKeys.PROFESSIONAL_UNCONFIGURED:
        return UserDomainClasses.PROFESSIONAL;
      default:
        throw new AppError(
          "INTERNAL_SERVER_ERROR",
          i18n.__("ErrorRoleNotFound")
        );
    }
  };

  protected async createUserOperation(
    {
      CPF,
      birthDate,
      name,
      address,
      contactNumber,
      email,
      clinicId,
      password,
      userName,
    }: CreateUserRequestModel,
    id: string,
    role: string,
    savePassword = true
  ): Promise<void> {
    if (stringIsNullOrEmpty(userName))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUserNameRequired"));

    if (this.validatorsProvider.userName(userName))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUserNameWithWhiteSpace"));

    const [hasUserName] = await transaction([
      this.userRepository.hasUserName(id, userName),
    ]);

    if (hasUserName)
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUserNameAlreadyExists"));

    if (savePassword && password) {
      if (stringIsNullOrEmpty(password))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorPasswordRequired"));

      if (this.passwordProvider.outOfBounds(password))
        throw new AppError(
          "BAD_REQUEST",
          i18n.__mf("ErrorPasswordOutOfBounds", [
            this.passwordProvider.MIN_LENGTH,
            this.passwordProvider.MAX_LENGTH,
          ])
        );

      if (!this.passwordProvider.hasStrength(password))
        throw new AppError("BAD_REQUEST", i18n.__("ErrorPasswordToWeak"));
    }

    const salt = toNumber({
      value: env("PASSWORD_HASH_SALT"),
      error: new AppError(
        "INTERNAL_SERVER_ERROR",
        i18n.__("ErrorMissingEnvVar")
      ),
    });

    const [hasRole] = await transaction([
      this.authenticationRepository.getRoleByName(role),
    ]);

    if (!hasRole)
      throw new AppError("INTERNAL_SERVER_ERROR", i18n.__("ErrorRoleNotFound"));

    await super.createPersonOperation(
      {
        birthDate,
        CPF,
        name,
        address,
        contactNumber,
        email,
        clinicId,
      },
      id,
      this.getDomainClass(role)
    );

    this.userOperation = this.userRepository.save(hasRole.id, {
      id,
      password: savePassword
        ? await this.hashProvider.hash(password as string, salt)
        : "null",
      userName,
    } as UserModel);
  }
}

export { CreateUserService };
