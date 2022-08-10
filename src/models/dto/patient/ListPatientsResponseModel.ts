import { ListPeopleResponseModel } from "../person/ListPeopleResponseModel";

type ListPatientsResponseModel = ListPeopleResponseModel & {
  gender: string;
  maritalStatus: string;
  liable: Omit<ListPeopleResponseModel, "address"> | null;
};

export { ListPatientsResponseModel };
