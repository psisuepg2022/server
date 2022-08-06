import { ListPeopleResponseModel } from "../person/ListPeopleResponseModel";

type ListUsersResponseModel = ListPeopleResponseModel & {
  accessCode: number;
  userName: string;
};

export { ListUsersResponseModel };
