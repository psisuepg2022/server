import { CreateAddressRequestModel } from "./CreateAddressRequestModel";

type CreatePersonRequestModel = {
  email?: string;
  name: string;
  CPF: string;
  contactNumber?: string;
  birthDate: Date;
  address?: CreateAddressRequestModel;
};

export { CreatePersonRequestModel };
