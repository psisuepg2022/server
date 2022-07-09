import { RoleModel } from "@models/utils/RoleModel";

import { PersonModel } from "./PersonModel";

type UserModel = PersonModel & {
  userName: string;
  active?: boolean;
  blocked?: boolean;
  loginAttempts?: number;
  password: string;
  accessCode?: number;
  role?: RoleModel;
};

export { UserModel };
