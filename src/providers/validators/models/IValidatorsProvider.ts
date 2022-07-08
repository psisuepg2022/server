interface IValidatorsProvider {
  cpf(cpf: string): boolean;
  email(email: string): boolean;
  contactNumber(contactNumber: string): boolean;
}

export { IValidatorsProvider };
