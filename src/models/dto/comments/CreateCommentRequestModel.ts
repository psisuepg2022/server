type CreateCommentRequestModel = {
  text: string | null;
  appointmentId: string;
  professionalId: string;
  blankComments: boolean;
};

export { CreateCommentRequestModel };
