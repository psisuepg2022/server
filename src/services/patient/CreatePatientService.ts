import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { AppError } from "@handlers/error/AppError";
import { transaction } from "@infra/database/transaction";
import { GenderDomain } from "@infra/domains/GenderDomain";
import { MaritalStatusDomain } from "@infra/domains/MaritalStatusDomain";
import { PatientModel } from "@models/domain/PatientModel";
import { CreatePatientRequestModel } from "@models/dto/patient/CreatePatientRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IAddressRepository } from "@repositories/address";
import { IClinicRepository } from "@repositories/clinic";
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
    private patientRepository: IPatientRepository
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

  public async execute({
    CPF,
    birthDate,
    clinicId,
    name,
    address,
    contactNumber,
    email,
    gender,
    maritalStatus,
  }: CreatePatientRequestModel): Promise<Partial<PatientModel>> {
    const id = this.uniqueIdentifierProvider.generate();

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
      UserDomainClasses.PATIENT
    );

    const createPatientOperation = this.patientRepository.save(id, {
      gender,
      maritalStatus,
    } as PatientModel);

    const [person, patient, addressSaved] = await transaction(
      ((): PrismaPromise<any>[] =>
        address
          ? [
              this.getCreatePersonOperation(),
              createPatientOperation,
              this.getAddressOperation(),
            ]
          : [this.getCreatePersonOperation(), createPatientOperation])()
    );

    return {
      ...patient,
      ...person,
      address: addressSaved,
      CPF: this.maskProvider.cpf(person.CPF),
      birthDate: this.maskProvider.date(person.birthDate),
      contactNumber: this.maskProvider.contactNumber(person.contactNumber),
    } as Partial<PatientModel>;
  }
}

export { CreatePatientService };
