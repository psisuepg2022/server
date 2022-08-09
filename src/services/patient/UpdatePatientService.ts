import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { PatientModel } from "@models/domain/PatientModel";
import { CreatePatientRequestModel } from "@models/dto/patient/CreatePatientRequestModel";
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

  protected getId = (id?: string): string => id as string;

  public async execute(
    { id, clinicId }: CreatePatientRequestModel,
    _: CreatePersonRequestModel | string | null = null
  ): Promise<Partial<PatientModel>> {
    if (!id || stringIsNullOrEmpty(id))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["paciente"])
      );

    if (!this.uniqueIdentifierProvider.isValid(id))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    await super.validateClinicId(clinicId);

    const [hasPatient] = await transaction([
      this.patientRepository.getToUpdate(clinicId, id),
    ]);

    if (!hasPatient)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDNotFound", ["paciente"])
      );

    return {};
  }
}

export { UpdatePatientService };
