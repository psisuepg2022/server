import { CreateUserRequestModel } from "../user/CreateUserRequestModel";

type CreateProfessionalRequestModel = CreateUserRequestModel & {
  profession: string;
  specialization?: string;
  baseDuration: string;
  registry: string;
};

export { CreateProfessionalRequestModel };
