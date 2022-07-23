import { UserModel } from "./UserModel";

type ProfessionalModel = UserModel & {
  profession: string;
  specialization?: string;
  baseDuration: number;
  registry: string;
};

export { ProfessionalModel };
