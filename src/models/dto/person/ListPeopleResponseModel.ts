import { AddressModel } from "@models/domain/AddressModel";

type ListPeopleResponseModel = {
  birthDate: string;
  contactNumber: string;
  CPF: string;
  email: string;
  name: string;
  id: string;
  address?: AddressModel;
};

export { ListPeopleResponseModel };
