import i18n, { __ } from "i18n";
import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { time2date } from "@helpers/time2date";
import { transaction } from "@infra/database/transaction";
import { DaysOfTheWeek } from "@infra/domains";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";
import { WeeklyScheduleModel } from "@models/domain/WeeklyScheduleModel";
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
import { IScheduleRepository } from "@repositories/schedule";
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
    private professionalRepository: IProfessionalRepository,
    @inject("ScheduleRepository")
    private scheduleRepository: IScheduleRepository
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
    profession,
    registry,
    specialization,
  }: CreateProfessionalRequestModel): Promise<Partial<ProfessionalModel>> {
    const id = this.uniqueIdentifierProvider.generate();

    if (stringIsNullOrEmpty(profession))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorProfessionRequired"));

    if (stringIsNullOrEmpty(registry))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorRegistryRequired"));

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
      profession,
      registry,
      specialization,
    } as ProfessionalModel);

    const [createWeeklyScheduleOperation, createWeeklyScheduleLocksOperation] =
      this.getWeeklyScheduleOperations(id);

    const [person, user, professional, addressSaved] = await transaction(
      ((): PrismaPromise<any>[] =>
        address
          ? [
              this.getCreatePersonOperation(),
              this.getCreateUserOperation(),
              createProfessionalOperation,
              this.getAddressOperation(),
              ...createWeeklyScheduleOperation,
              ...createWeeklyScheduleLocksOperation,
            ]
          : [
              this.getCreatePersonOperation(),
              this.getCreateUserOperation(),
              createProfessionalOperation,
              ...createWeeklyScheduleOperation,
              ...createWeeklyScheduleLocksOperation,
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

  private getWeeklyScheduleOperations = (
    professionalId: string
  ): [
    PrismaPromise<WeeklyScheduleModel>[],
    PrismaPromise<WeeklyScheduleLockModel>[]
  ] => {
    const days = Object.values(DaysOfTheWeek).filter(
      (item: string | number) => typeof item === "number"
    ) as number[];

    const ids = days.map(() => this.uniqueIdentifierProvider.generate());

    const createWeeklyScheduleOperation = days.map(
      (item: number, index: number): PrismaPromise<WeeklyScheduleModel> =>
        this.scheduleRepository.saveWeeklyScheduleItem(professionalId, {
          id: ids[index],
          dayOfTheWeek: item,
          startTime: time2date("08:00"),
          endTime: time2date("17:00"),
        })
    );

    const createWeeklyScheduleLocksOperation = ids.map(
      (id: string): PrismaPromise<WeeklyScheduleLockModel> =>
        this.scheduleRepository.saveWeeklyScheduleLockItem(id, {
          id: this.uniqueIdentifierProvider.generate(),
          startTime: time2date("12:00"),
          endTime: time2date("13:00"),
        })
    );

    return [createWeeklyScheduleOperation, createWeeklyScheduleLocksOperation];
  };
}

export { CreateProfessionalService };
