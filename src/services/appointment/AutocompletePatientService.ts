import { AutocompletePatientRequestModel } from "@models/dto/appointment/AutocompletePatientRequestModel";
import { AutocompletePatientResponseModel } from "@models/dto/appointment/AutocompletePatientResponseModel";

class AutocompletePatientService {
  async execute(
    _: AutocompletePatientRequestModel
  ): Promise<AutocompletePatientResponseModel> {
    return {} as AutocompletePatientResponseModel;
  }
}

export { AutocompletePatientService };
