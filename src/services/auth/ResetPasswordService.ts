import { ResetPasswordRequestModel } from "@models/dto/auth/ResetPasswordRequestModel";

class ResetPasswordService {
  public async execute(_: ResetPasswordRequestModel): Promise<boolean> {
    return true;
  }
}

export { ResetPasswordService };
