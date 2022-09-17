import { AddressModel } from "@models/domain/AddressModel";

type GetProfileResponseModel = {
  name: string;
  email?: string;
  CPF: string;
  birthDate: string;
  address: AddressModel;
};

export { GetProfileResponseModel };
