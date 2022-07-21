import { GenderDomain } from "@infra/domains/GenderDomain";
import { MaritalStatusDomain } from "@infra/domains/MaritalStatusDomain";

import { LiableModel } from "./LiableModel";
import { PersonModel } from "./PersonModel";

type PatientModel = PersonModel & {
  maritalStatus: MaritalStatusDomain;
  gender: GenderDomain;
  liable?: LiableModel;
};

export { PatientModel };
