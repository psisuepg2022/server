import { CreateClinicRequestModel } from "../clinic/CreateClinicRequestModel";
import { CreateUserRequestModel } from "../user/CreateUserRequestModel";

type UpdateOwnerRequestModel = CreateUserRequestModel & {
  clinic?: CreateClinicRequestModel;
};

export { UpdateOwnerRequestModel };
