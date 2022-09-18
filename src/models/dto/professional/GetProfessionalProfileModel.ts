import { GetUserProfileResponseModel } from "../user/GetUserProfileResponseModel";

type GetProfessionalProfileModel = GetUserProfileResponseModel & {
  specialization?: string;
};

export { GetProfessionalProfileModel };
