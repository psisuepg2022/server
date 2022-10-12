import { PersonModel } from "./PersonModel";

type UserModel = PersonModel & {
  userName: string;
  blocked: boolean;
  loginAttempts: number;
  password: string;
};

export { UserModel };
