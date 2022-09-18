import { GetUserProfileResponseModel } from "../user/GetUserProfileResponseModel";

type GetProfessionalProfileModel = GetUserProfileResponseModel & {
  specialization?: string;
  profession: string;
  registry: string;
};

export { GetProfessionalProfileModel };
