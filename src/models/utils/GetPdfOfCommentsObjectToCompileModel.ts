type GetPdfOfCommentsObjectToCompileModel = {
  clinic: string;
  patient: string;
  professional: string;
  appointment: {
    date: string;
    start: string;
    end: string;
  };
  image: string;
};

export { GetPdfOfCommentsObjectToCompileModel };
