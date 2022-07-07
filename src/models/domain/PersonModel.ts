import { AddresModel } from "./AddressModel";

type PersonModel = {
  id: string;
  email: string;
  name: string;
  class: string;
  CPF: string;
  birthDate: Date;
  contactNumber: string;
  address: AddresModel;
};

export { PersonModel };
