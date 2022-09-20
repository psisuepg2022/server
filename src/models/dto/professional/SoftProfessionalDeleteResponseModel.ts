import { PersonModel } from "@models/domain/PersonModel";

type SoftProfessionalDeleteResponseModel = {
  header: string;
  patientsToCall: Partial<PersonModel>[];
};

export { SoftProfessionalDeleteResponseModel };
