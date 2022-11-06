import { UserModel } from "./UserModel";

type ProfessionalModel = UserModel & {
  profession: string;
  specialization: string | null;
  baseDuration: number;
  registry: string;
};

export { ProfessionalModel };
