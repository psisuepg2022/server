import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { PatientModel } from "@models/domain/PatientModel";
import { CreatePatientRequestModel } from "@models/dto/patient/CreatePatientRequestModel";
import { CreateAddressRequestModel } from "@models/dto/person/CreateAddressRequestModel";
import { CreatePersonRequestModel } from "@models/dto/person/CreatePersonRequestModel";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IAddressRepository } from "@repositories/address";
import { IClinicRepository } from "@repositories/clinic";
import { ILiableRepository } from "@repositories/liable";
import { IPatientRepository } from "@repositories/patient";
import { IPersonRepository } from "@repositories/person";

import { CreatePatientService } from "./CreatePatientService";

@injectable()
class UpdatePatientService extends CreatePatientService {
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
    patientRepository: IPatientRepository,
    @inject("LiableRepository")
    liableRepository: ILiableRepository
  ) {
    super(
      uniqueIdentifierProvider,
      validatorsProvider,
      personRepository,
      clinicRepository,
      addressRepository,
      maskProvider,
      patientRepository,
      liableRepository
    );
  }

  public async execute(
    {
      id,
      clinicId,
      CPF,
      birthDate,
      gender,
      maritalStatus,
      name,
      address,
      contactNumber,
      email,
    }: CreatePatientRequestModel,
    liable: CreatePersonRequestModel | null = null
  ): Promise<Partial<PatientModel>> {
    if (!id || stringIsNullOrEmpty(id))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["paciente"])
      );

    if (!this.uniqueIdentifierProvider.isValid(id))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const [hasPatient] = await transaction([
      this.patientRepository.getToUpdate(clinicId, id),
    ]);

    if (!hasPatient)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDNotFound", ["paciente"])
      );

    const addressToSave = ((): CreateAddressRequestModel | undefined => {
      if (address) {
        if (
          !hasPatient.person.address?.id ||
          stringIsNullOrEmpty(hasPatient.person.address?.id as string)
        )
          return {
            ...address,
            id: this.uniqueIdentifierProvider.generate(),
          };

        if (address.id !== hasPatient.person.address.id)
          throw new AppError(
            "BAD_REQUEST",
            i18n.__("ErrorUpdateAddressOtherId")
          );

        return {
          ...address,
          id: hasPatient.person.address?.id,
        };
      }

      return undefined;
    })();

    const liableToSave = ((): CreatePersonRequestModel | null => {
      if (liable !== null) {
        return !hasPatient.liable?.person?.id ||
          stringIsNullOrEmpty(hasPatient.liable?.person?.id as string)
          ? liable
          : {
              ...liable,
              clinicId,
              id: hasPatient.liable.person.id,
            };
      }

      return null;
    })();

    const updated = await super.execute(
      {
        id,
        clinicId,
        contactNumber,
        email,
        CPF: CPF || hasPatient.person.CPF || "",
        birthDate: `${
          birthDate || hasPatient.person.birthDate?.toISOString().split("T")[0]
        }`,
        name: name || hasPatient.person.name || "",
        gender: gender || hasPatient.gender?.toString() || "",
        maritalStatus:
          maritalStatus || hasPatient.maritalStatus?.toString() || "",
        address: addressToSave,
      },
      liableToSave
    );

    return updated;
  }
}

export { UpdatePatientService };
