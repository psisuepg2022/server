interface IHashProvider {
  hash(payload: string, salt: number): Promise<string>;
  compare(payload: string, hashed: string): Promise<boolean>;
}

export { IHashProvider };
