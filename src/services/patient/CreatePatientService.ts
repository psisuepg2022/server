import { injectable } from "tsyringe";

import { PatientModel } from "@models/domain/PatientModel";
import { CreatePatientRequestModel } from "@models/dto/patient/CreatePatientRequestModel";

@injectable()
class CreatePatientService {
  public async execute(
    _: CreatePatientRequestModel
  ): Promise<Partial<PatientModel>> {
    return {};
  }
}

export { CreatePatientService };
