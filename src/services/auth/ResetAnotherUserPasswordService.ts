import { ResetAnotherUserPasswordRequestModel } from "@models/dto/auth/ResetAnotherUserPasswordRequestModel";

class ResetAnotherUserPasswordService {
  public async execute(
    _: ResetAnotherUserPasswordRequestModel
  ): Promise<boolean> {
    return true;
  }
}

export { ResetAnotherUserPasswordService };
