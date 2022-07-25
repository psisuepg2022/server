type AuthTokenPayloadModel = {
  id: string;
  email?: string;
  name: string;
  accessCode: number;
  userName: string;
  clinic: {
    id: string;
    name: string;
  };
  type: "access_token" | "refresh_token";
  iat: number;
  exp: number;
};

export { AuthTokenPayloadModel };
