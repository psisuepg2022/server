import i18n, { __ } from "i18n";
import { inject, injectable } from "tsyringe";

import { RolesKeys } from "@common/RolesKeys";
import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { DaysOfTheWeek } from "@infra/domains";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";
import { WeeklyScheduleModel } from "@models/domain/WeeklyScheduleModel";
import { CreateProfessionalRequestModel } from "@models/dto/professional/CreateProfessionalRequestModel";
import { PrismaPromise } from "@prisma/client";
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
    hashProvider: IHashProvider,
    @inject("AuthenticationRepository")
    authenticationRepository: IAuthenticationRepository,
    @inject("AddressRepository")
    addressRepository: IAddressRepository,
    @inject("ProfessionalRepository")
    protected professionalRepository: IProfessionalRepository,
    @inject("ScheduleRepository")
    private scheduleRepository: IScheduleRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
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
      hashProvider,
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
      profession,
      registry,
      specialization,
    }: CreateProfessionalRequestModel,
    createSchedule = false,
    savePassword = true
  ): Promise<Partial<ProfessionalModel> & { accessCode: number }> {
    const id = this.getObjectId(idReceived);

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
      RolesKeys.PROFESSIONAL_UNCONFIGURED,
      savePassword
    );

    const createProfessionalOperation = this.professionalRepository.save(id, {
      profession,
      registry,
      specialization,
    } as ProfessionalModel);

    const [
      person,
      { person: accessCode, ...user },
      professional,
      addressSaved,
    ] = await transaction(
      ((): PrismaPromise<any>[] => {
        const list = [
          this.getCreatePersonOperation(),
          this.getCreateUserOperation(),
          createProfessionalOperation,
        ];

        if (address) list.push(this.getAddressOperation());

        if (createSchedule) {
          const [
            createWeeklyScheduleOperation,
            createWeeklyScheduleLocksOperation,
          ] = this.getWeeklyScheduleOperations(id);

          list.push(...createWeeklyScheduleOperation);
          list.push(...createWeeklyScheduleLocksOperation);
        }

        return list;
      })()
    );

    return {
      ...user,
      ...person,
      ...professional,
      accessCode: accessCode.clinic.code,
      address: addressSaved
        ? {
            ...addressSaved,
            zipCode: this.maskProvider.zipCode(address?.zipCode || ""),
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
          startTime: this.dateProvider.time2date("08:00"),
          endTime: this.dateProvider.time2date("17:00"),
        })
    );

    const createWeeklyScheduleLocksOperation = ids.map(
      (id: string): PrismaPromise<WeeklyScheduleLockModel> =>
        this.scheduleRepository.saveWeeklyScheduleLockItem(id, {
          id: this.uniqueIdentifierProvider.generate(),
          startTime: this.dateProvider.time2date("12:00"),
          endTime: this.dateProvider.time2date("13:00"),
        })
    );

    return [createWeeklyScheduleOperation, createWeeklyScheduleLocksOperation];
  };
}

export { CreateProfessionalService };
