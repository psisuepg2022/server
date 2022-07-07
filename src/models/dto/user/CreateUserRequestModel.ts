import { CreatePersonRequestModel } from "../person/CreatePersonRequestModel";

type CreateUserRequestModel = CreatePersonRequestModel & {
  userName: string;
  password: string;
};

export { CreateUserRequestModel };
