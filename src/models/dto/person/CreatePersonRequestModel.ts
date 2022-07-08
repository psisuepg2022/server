import { CreateAddressRequestModel } from "./CreateAddressRequestModel";

type CreatePersonRequestModel = {
  email?: string;
  name: string;
  CPF: string;
  contactNumber?: string;
  birthDate: Date;
  clinicId: string;
  address?: CreateAddressRequestModel;
};

export { CreatePersonRequestModel };
