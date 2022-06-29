interface IUniqueIdentifierProvider {
  generate(): string;
  isValid(id: string): boolean;
}

export { IUniqueIdentifierProvider };
