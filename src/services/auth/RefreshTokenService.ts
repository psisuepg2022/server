import { LoginResponseModel } from "@models/dto/auth/LoginResponseModel";

class RefreshTokenService {
  public async execute(_: string): Promise<LoginResponseModel> {
    return {
      accessToken: "",
      refreshToken: "",
    };
  }
}

export { RefreshTokenService };
