import { SearchPersonRequestModel } from "../person/SearchPersonRequestModel";

type SearchProfessionalPatientsRequestModel = SearchPersonRequestModel & {
  professionalId: string;
};

export { SearchProfessionalPatientsRequestModel };
