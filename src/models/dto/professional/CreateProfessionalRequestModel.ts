import { CreateUserRequestModel } from "../user/CreateUserRequestModel";

type CreateProfessionalRequestModel = CreateUserRequestModel & {
  profession: string;
  specialization?: string;
  registry: string;
};

export { CreateProfessionalRequestModel };
