import { LoginRequestModel } from "@models/dto/auth/LoginRequestModel";
import { LoginResponseModel } from "@models/dto/auth/LoginResponseModel";

class LoginService {
  public async execute(_: LoginRequestModel): Promise<LoginResponseModel> {
    return {} as LoginResponseModel;
  }
}

export { LoginService };
