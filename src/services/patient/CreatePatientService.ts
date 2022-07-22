import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { AppError } from "@handlers/error/AppError";
import { getEnumDescription } from "@helpers/getEnumDescription";
import { transaction } from "@infra/database/transaction";
import { GenderDomain, MaritalStatusDomain } from "@infra/domains";
import { PatientModel } from "@models/domain/PatientModel";
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
    liable: CreatePersonRequestModel | null = null
  ): Promise<Partial<PatientModel>> {
    const id = this.uniqueIdentifierProvider.generate();
    const liableId = liable ? this.uniqueIdentifierProvider.generate() : "";

    if (!(gender in GenderDomain))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorValueOutOfGenderDomain"));

    if (!(maritalStatus in MaritalStatusDomain))
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

    if (liable !== null)
      await this.createPersonOperation(
        liable,
        liableId,
        UserDomainClasses.LIABLE
      );

    const createPatientOperation = this.patientRepository.save(id, {
      gender,
      maritalStatus,
    } as PatientModel);

    const [person, patient, ...optional] = await transaction(
      ((): PrismaPromise<any>[] => {
        const list = [createPatientPersonOperation, createPatientOperation];

        if (address) list.push(this.getAddressOperation());

        if (liable) {
          const createLiableRelationOperation = this.liableRepository.save(
            id,
            liableId
          );

          list.push(this.getCreatePersonOperation());
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

    return {
      ...patient,
      ...person,
      CPF: this.maskProvider.cpf(person.CPF),
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
              ...optional[liableIndex],
              CPF: this.maskProvider.cpf(optional[liableIndex].CPF),
              birthDate: this.maskProvider.date(
                optional[liableIndex].birthDate
              ),
              contactNumber: this.maskProvider.contactNumber(
                optional[liableIndex].contactNumber
              ),
            }
          : null,
    } as Partial<PatientModel>;
  }
}

export { CreatePatientService };
