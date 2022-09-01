type AuthTokenPayloadModel = {
  id: string;
  email?: string;
  name: string;
  accessCode: number;
  userName: string;
  userType: string;
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
