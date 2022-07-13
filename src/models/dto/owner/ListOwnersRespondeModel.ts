import { ListUsersResponseModel } from "../user/ListUsersResonseModel";

type ListOwnersResponseModel = ListUsersResponseModel & {
  active: boolean;
};

export { ListOwnersResponseModel };
