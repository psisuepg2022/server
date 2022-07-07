import { PersonModel } from "./PersonModel";

type UserModel = PersonModel & {
  userName: string;
  active: boolean;
  blocked: boolean;
  loginAttempts: number;
  password: string;
  accessCode: number;
};

export { UserModel };
