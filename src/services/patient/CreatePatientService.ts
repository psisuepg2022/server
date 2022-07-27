import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { AppError } from "@handlers/error/AppError";
import { getEnumDescription } from "@helpers/getEnumDescription";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { toNumber } from "@helpers/toNumber";
import { transaction } from "@infra/database/transaction";
import { GenderDomain, MaritalStatusDomain } from "@infra/domains";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { CreatePatientRequestModel } from "@models/dto/patient/CreatePatientRequestModel";
import { CreatePersonRequestModel } from "@models/dto/person/CreatePersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IAddressRepository } from "@repositories/address";
import { IClinicRepository } from "@repositories/clinic";
import { ILiableRepository } from "@repositories/liable";
import { IPatientRepository } from "@repositories/patient";
import { IPersonRepository } from "@repositories/person";
import { CreatePersonService } from "@services/person";

@injectable()
class CreatePatientService extends CreatePersonService {
  constructor(
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ValidatorsProvider")
    validatorsProvider: IValidatorsProvider,
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("ClinicRepository")
    clinicRepository: IClinicRepository,
    @inject("AddressRepository")
    addressRepository: IAddressRepository,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("PatientRepository")
    private patientRepository: IPatientRepository,
    @inject("LiableRepository")
    private liableRepository: ILiableRepository
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

  public async execute(
    {
      CPF,
      birthDate,
      clinicId,
      name,
      address,
      contactNumber,
      email,
      gender,
      maritalStatus,
    }: CreatePatientRequestModel,
    liable: CreatePersonRequestModel | string | null = null
  ): Promise<Partial<PatientModel>> {
    const liableExisting = liable && typeof liable === "string";

    const id = this.uniqueIdentifierProvider.generate();
    const liableId = !liableExisting
      ? this.uniqueIdentifierProvider.generate()
      : "";

    const hasLiable = await (async (): Promise<
      (Partial<PersonModel> & { person: PersonModel }) | null
    > => {
      if (liableExisting) {
        if (stringIsNullOrEmpty(liable))
          throw new AppError("BAD_REQUEST", i18n.__("ErrorLiableRequired"));

        if (!this.uniqueIdentifierProvider.isValid(liable))
          throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

        const [_hasLiable] = await transaction([
          this.liableRepository.hasLiablePersonSaved(liable),
        ]);

        if (!_hasLiable)
          throw new AppError("NOT_FOUND", i18n.__("ErrorLiableNotFound"));

        return _hasLiable;
      }
      return null;
    })();

    if (stringIsNullOrEmpty(gender))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorGenderRequired"));

    if (stringIsNullOrEmpty(maritalStatus))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorMaritalStatusRequired"));

    const genderConverted = toNumber({
      value: gender,
      error: new AppError("BAD_REQUEST", i18n.__("ErrorGenderInvalid")),
    });

    const maritalStatusConverted = toNumber({
      value: maritalStatus,
      error: new AppError("BAD_REQUEST", i18n.__("ErrorMaritalStatusInvalid")),
    });

    if (!(genderConverted in GenderDomain))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorValueOutOfGenderDomain"));

    if (!(maritalStatusConverted in MaritalStatusDomain))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorValueOutOfMaritalStatusDomain")
      );

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
      UserDomainClasses.PATIENT,
      liable === null
    );

    const createPatientPersonOperation = this.getCreatePersonOperation();

    if (liable !== null && typeof liable !== "string")
      await this.createPersonOperation(
        liable,
        liableId,
        UserDomainClasses.LIABLE
      );

    const createPatientOperation = this.patientRepository.save(id, {
      gender: genderConverted,
      maritalStatus: maritalStatusConverted,
    } as PatientModel);

    const [person, patient, ...optional] = await transaction(
      ((): PrismaPromise<any>[] => {
        const list = [createPatientPersonOperation, createPatientOperation];

        if (address) list.push(this.getAddressOperation());

        if (liable) {
          const createLiableRelationOperation = this.liableRepository.save(
            id,
            liableExisting ? liable : liableId
          );

          if (!liableExisting) list.push(this.getCreatePersonOperation());
          list.push(createLiableRelationOperation);
        }

        return list;
      })()
    );

    const [liableIndex, addressIndex] = ((): [number, number] => [
      // eslint-disable-next-line no-nested-ternary
      liable ? (address ? 1 : 0) : -1,
      address ? 0 : -1,
    ])();

    const liableToSend = liableExisting
      ? hasLiable?.person
      : optional[liableIndex];

    return {
      ...patient,
      ...person,
      CPF: CPF ? this.maskProvider.cpf(person.CPF) : "",
      birthDate: this.maskProvider.date(person.birthDate),
      contactNumber: this.maskProvider.contactNumber(person.contactNumber),
      gender: getEnumDescription("GENDER", GenderDomain[patient.gender]),
      maritalStatus: getEnumDescription(
        "MARITAL_STATUS",
        MaritalStatusDomain[patient.maritalStatus]
      ),
      address:
        addressIndex !== -1
          ? {
              ...optional[addressIndex],
              zipCode: this.maskProvider.zipCode(
                optional[addressIndex]?.zipCode || ""
              ),
            }
          : null,
      liable:
        liableIndex !== -1
          ? {
              ...liableToSend,
              CPF: this.maskProvider.cpf(liableToSend.CPF),
              birthDate: this.maskProvider.date(liableToSend.birthDate),
              contactNumber: this.maskProvider.contactNumber(
                liableToSend.contactNumber
              ),
            }
          : null,
    } as Partial<PatientModel>;
  }
}

export { CreatePatientService };
