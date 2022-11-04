type SaveCommentResponseModel = {
  text: string;
  appointmentId: string;
  updatedAt: string;
  status: string;
  hasSameTimeToNextWeek: {
    patientId: string;
    date: string;
    startTime: string;
    endTime: string;
  } | null;
};

export { SaveCommentResponseModel };
