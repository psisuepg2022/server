type GetPdfOfCommentsObjectToCompileModel = {
  clinic: string;
  patient: string;
  professional: string;
  content: string;
  appointment: {
    date: string;
    start: string;
    end: string;
  };
  imageUrl: string;
};

export { GetPdfOfCommentsObjectToCompileModel };
