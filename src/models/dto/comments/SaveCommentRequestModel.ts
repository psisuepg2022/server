type SaveCommentRequestModel = {
  text: string | null;
  appointmentId: string;
  professionalId: string;
  blankComments: boolean;
};

export { SaveCommentRequestModel };
