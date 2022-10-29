import { PersonModel } from "./PersonModel";

type UserModel = PersonModel & {
  userName: string;
  blocked: boolean;
  loginAttempts: number;
  lastFailedLoginDate: Date | null;
  password: string;
};

export { UserModel };
