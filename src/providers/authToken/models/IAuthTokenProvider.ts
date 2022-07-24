interface IAuthTokenProvider {
  generate(payload: any): string;
  decode(token: string): any;
  verify(token: string): boolean;
}

export { IAuthTokenProvider };
