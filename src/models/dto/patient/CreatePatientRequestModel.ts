import { CreatePersonRequestModel } from "../person/CreatePersonRequestModel";

type CreatePatientRequestModel = CreatePersonRequestModel & {
  maritalStatus: string;
  gender: string;
};

export { CreatePatientRequestModel };
