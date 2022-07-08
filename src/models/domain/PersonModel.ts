import { Clinic } from "@prisma/client";

import { AddresModel } from "./AddressModel";

type PersonModel = {
  id: string;
  email?: string;
  name: string;
  domainClass: string;
  CPF: string;
  birthDate: Date;
  contactNumber?: string;
  clinic?: Clinic;
  clinicId: string;
  address?: AddresModel;
};

export { PersonModel };
