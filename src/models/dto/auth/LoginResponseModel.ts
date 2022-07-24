import { ClinicModel } from "@models/domain/ClinicModel";

type LoginResponseModel = {
  accessCode: number;
  name: string;
  email?: string;
  id: string;
  accessToken: string;
  refreshToken: string;
  clinic: Partial<ClinicModel>;
};

export { LoginResponseModel };
