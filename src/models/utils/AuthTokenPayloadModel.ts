type AuthTokenPayloadModel = {
  id: string;
  baseDuration?: number;
  name: string;
  clinic: {
    id: string;
    name: string;
    email: string;
    code: number;
  };
  type: "access_token" | "refresh_token";
  iat: number;
  exp: number;
  permissions: string[];
};

export { AuthTokenPayloadModel };
