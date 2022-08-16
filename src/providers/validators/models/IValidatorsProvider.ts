interface IValidatorsProvider {
  cpf(cpf: string): boolean;
  email(email: string): boolean;
  contactNumber(contactNumber: string): boolean;
  zipCode(zipCode: string): boolean;
  time(time: string): boolean;
  date(date: string): boolean;
  length(str: string, length: number): boolean;
}

export { IValidatorsProvider };
