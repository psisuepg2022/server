import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { IPaginationResponse } from "@infra/http";
import { AutocompletePatientRequestModel } from "@models/dto/appointment/AutocompletePatientRequestModel";
import { AutocompletePatientResponseModel } from "@models/dto/appointment/AutocompletePatientResponseModel";
import { IMaskProvider } from "@providers/mask";
import { IPatientRepository } from "@repositories/patient";

@injectable()
class AutocompletePatientService {
  constructor(
    @inject("MaskProvider")
    private maskProvider: IMaskProvider,
    @inject("PatientRepository")
    private patientRepository: IPatientRepository
  ) {}

  async execute({
    clinicId,
    name,
    professionalId,
  }: AutocompletePatientRequestModel): Promise<
    IPaginationResponse<AutocompletePatientResponseModel>
  > {
    if (stringIsNullOrEmpty(name))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorAutocompletePatientNameRequired")
      );

    const [count, patients] = await transaction([
      this.patientRepository.countToAutocomplete(
        clinicId,
        name,
        professionalId
      ),
      this.patientRepository.getToAutocomplete(clinicId, name, professionalId),
    ]);

    return {
      totalItems: count,
      items: patients.map(
        (item): AutocompletePatientResponseModel => ({
          contactNumber: this.maskProvider.contactNumber(
            item.person.contactNumber || ""
          ),
          name: item.person.name || "",
          id: item.person.id || "",
          CPF: item.person.CPF
            ? this.maskProvider.cpf(item.person.CPF)
            : undefined,
          liable: item.liable
            ? {
                contactNumber: this.maskProvider.contactNumber(
                  item.liable.person.contactNumber || ""
                ),
                CPF: this.maskProvider.cpf(item.liable.person.CPF || ""),
                name: item.liable.person.name || "",
              }
            : undefined,
        })
      ),
    };
  }
}

export { AutocompletePatientService };
