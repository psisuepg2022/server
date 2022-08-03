import { CreateAddressRequestModel } from "./CreateAddressRequestModel";

type CreatePersonRequestModel = {
  email?: string;
  name: string;
  CPF: string;
  contactNumber?: string;
  birthDate: string;
  clinicId: string;
  address?: CreateAddressRequestModel;
};

export { CreatePersonRequestModel };
