import { GenderDomain } from "@infra/domains/GenderDomain";
import { MaritalStatusDomain } from "@infra/domains/MaritalStatusDomain";

import { PersonModel } from "./PersonModel";

type PatientModel = PersonModel & {
  maritalStatus: MaritalStatusDomain;
  gender: GenderDomain;
};

export { PatientModel };
