import { AuthTokenPayloadModel } from "@models/utils/AuthTokenPayloadModel";

interface IAuthTokenProvider {
  generate(payload: AuthTokenPayloadModel): string;
  decode(token: string): AuthTokenPayloadModel;
  verify(token: string): boolean;
}

export { IAuthTokenProvider };
