import { RoleModel } from "@models/utils/RoleModel";

import { PersonModel } from "./PersonModel";

type UserModel = PersonModel & {
  userName: string;
  active: boolean;
  blocked: boolean;
  loginAttempts: number;
  password: string;
  role: RoleModel;
};

export { UserModel };
