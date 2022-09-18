import { GetUserProfileResponseModel } from "../user/GetUserProfileResponseModel";

type GetProfessionalProfileResponseModel = GetUserProfileResponseModel & {
  specialization?: string;
  profession: string;
  registry: string;
};

export { GetProfessionalProfileResponseModel };
