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
    protected patientRepository: IPatientRepository,
    @inject("LiableRepository")
    protected liableRepository: ILiableRepository
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

  protected handlingHasCpf = (domainConflicting: string): void => {
    if (/^(?:Object\.Person\.User)/.test(domainConflicting))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUserCannotBePatient"));
  };

  public async execute(
    {
      id: idReceived,
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
    liableReceived: CreatePersonRequestModel | null = null
  ): Promise<Partial<PatientModel>> {
    const id = this.getObjectId(idReceived);
    const liableId = this.getObjectId(liableReceived?.id);

    if (stringIsNullOrEmpty(gender))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorGenderRequired"));

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

    const liable =
      await (async (): Promise<CreatePersonRequestModel | null> => {
        if (liableReceived && liableReceived.id) {
          if (!this.uniqueIdentifierProvider.isValid(liableReceived.id))
            throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

          const [_hasLiable] = await transaction([
            this.liableRepository.hasLiablePersonSaved(liableReceived.id),
          ]);

          if (!_hasLiable)
            throw new AppError("NOT_FOUND", i18n.__("ErrorLiableNotFound"));

          return {
            CPF: liableReceived.CPF || _hasLiable.CPF || "",
            birthDate:
              liableReceived.birthDate ||
              this.maskProvider.date(_hasLiable.birthDate || new Date()),
            name: liableReceived.name || _hasLiable.name,
            contactNumber:
              liableReceived.contactNumber ||
              this.maskProvider.contactNumber(_hasLiable.contactNumber || ""),
            email: liableReceived.email || _hasLiable.email,
            clinicId,
            id: _hasLiable.id,
          };
        }

        return liableReceived;
      })();

    let unlinkLiableOperation: PrismaPromise<any> | null = null;
    if (liableReceived === null) {
      const [_hasLiableToRemove] = await transaction([
        this.liableRepository.hasByPatient(id),
      ]);

      if (_hasLiableToRemove)
        unlinkLiableOperation = this.liableRepository.unlink(id);
    }

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

    if (liable)
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
            liableId
          );

          list.push(this.getCreatePersonOperation());
          list.push(createLiableRelationOperation);
        }

        if (unlinkLiableOperation) list.push(unlinkLiableOperation);

        return list;
      })()
    );

    const [liableIndex, addressIndex] = ((): [number, number] => [
      liable ? (address ? 1 : 0) : -1,
      address ? 0 : -1,
    ])();

    return {
      ...patient,
      ...person,
      CPF: person.CPF ? this.maskProvider.cpf(person.CPF) : "",
      birthDate: this.maskProvider.date(person.birthDate),
      email: person.email || undefined,
      contactNumber: person.contactNumber
        ? this.maskProvider.contactNumber(person.contactNumber)
        : undefined,
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
              contactNumber: optional[liableIndex].contactNumber
                ? this.maskProvider.contactNumber(
                    optional[liableIndex].contactNumber
                  )
                : undefined,
            }
          : null,
    } as Partial<PatientModel>;
  }
}

export { CreatePatientService };
