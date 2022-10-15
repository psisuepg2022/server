type PersonModel = {
  id: string;
  email: string | null;
  name: string;
  domainClass: string;
  CPF: string | null;
  birthDate: Date;
  active: boolean;
  contactNumber: string;
};

export { PersonModel };
