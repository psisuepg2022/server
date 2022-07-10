import { Clinic } from "@prisma/client";

import { AddressModel } from "./AddressModel";

type PersonModel = {
  id: string;
  email?: string;
  name: string;
  domainClass: string;
  CPF: string;
  birthDate: Date | string;
  contactNumber?: string;
  clinic?: Clinic;
  address?: AddressModel;
};

export { PersonModel };
