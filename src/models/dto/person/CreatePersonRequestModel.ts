import { CreateAddressRequestModel } from "./CreateAddressRequestModel";

type CreatePersonRequestModel = {
  id?: string;
  email: string | null;
  name: string;
  CPF: string;
  contactNumber: string;
  birthDate: string;
  clinicId: string;
  address?: CreateAddressRequestModel;
};

export { CreatePersonRequestModel };
