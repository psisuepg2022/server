import { AddressModel } from "@models/domain/AddressModel";

type ListPeopleResponseModel = {
  birthDate: string;
  contactNumber: string;
  CPF: string | null;
  email: string | null;
  name: string;
  id: string;
  address: AddressModel | null;
};

export { ListPeopleResponseModel };
