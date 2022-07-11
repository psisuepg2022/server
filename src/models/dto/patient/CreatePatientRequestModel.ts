import { CreatePersonRequestModel } from "../person/CreatePersonRequestModel";

type CreatePatientRequestModel = CreatePersonRequestModel & {
  maritalStatus: number;
  gender: number;
};

export { CreatePatientRequestModel };
