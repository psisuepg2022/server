import { ListPeopleResponseModel } from "../person/ListPeopleResponseModel";

type ListPatientsResponseModel = ListPeopleResponseModel & {
  gender: string;
  maritalStatus: string;
  age: number;
  liable: Omit<ListPeopleResponseModel, "address"> | null;
};

export { ListPatientsResponseModel };
