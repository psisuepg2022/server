import { AddressModel } from "@models/domain/AddressModel";

type GetUserProfileResponseModel = {
  id: string;
  name: string;
  email?: string;
  CPF: string;
  birthDate: string;
  address: AddressModel;
};

export { GetUserProfileResponseModel };
