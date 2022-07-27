import { Clinic } from "@prisma/client";

import { AddressModel } from "./AddressModel";

type PersonModel = {
  id: string;
  email: string | null;
  name: string;
  domainClass: string;
  CPF: string | null;
  birthDate: Date;
  contactNumber: string | null;
  clinic?: Clinic;
  address?: AddressModel;
};

export { PersonModel };
