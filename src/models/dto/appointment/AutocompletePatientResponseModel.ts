type AutocompletePatientResponseModel = {
  id: string;
  name: string;
  CPF?: string;
  contactNumber: string;
  liable?: {
    name: string;
    CPF: string;
    contactNumber: string;
  };
};

export { AutocompletePatientResponseModel };
