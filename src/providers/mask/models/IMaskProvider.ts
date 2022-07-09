interface IMaskProvider {
  remove(value: string): string;
  cpf(cpf: string): string;
  contactNumber(contactNumber: string): string;
  date(date: Date): string;
}

export { IMaskProvider };
