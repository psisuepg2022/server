type AuthTokenPayloadModel = {
  id: string;
  baseDuration?: number;
  clinic: {
    id: string;
    name: string;
  };
  type: "access_token" | "refresh_token";
  iat: number;
  exp: number;
  permissions: string[];
};

export { AuthTokenPayloadModel };
