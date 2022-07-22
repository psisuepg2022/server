import { GenderDomain, MaritalStatusDomain } from "@infra/domains";

import { LiableModel } from "./LiableModel";
import { PersonModel } from "./PersonModel";

type PatientModel = PersonModel & {
  maritalStatus: MaritalStatusDomain;
  gender: GenderDomain;
  liable?: LiableModel;
};

export { PatientModel };
