interface IPasswordProvider {
  generate(): string;
  hasStrength(password: string): boolean;

  readonly MIN_LENGTH: number;
  readonly IS_REQUIRED: string[];
}

export { IPasswordProvider };
