import { ListUsersResponseModel } from "../user/ListUsersResonseModel";

type ListProfessionalsResponseModel = ListUsersResponseModel & {
  profession: string;
  specialization?: string;
  baseDuration: number;
  registry: string;
};

export { ListProfessionalsResponseModel };
