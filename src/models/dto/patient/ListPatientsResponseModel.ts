import { ListPeopleResponseModel } from "../person/ListPeopleResponseModel";

type ListPatientsResponseModel = ListPeopleResponseModel & {
  gender: string;
  maritalStatus: string;
};

export { ListPatientsResponseModel };
