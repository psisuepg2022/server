type ResetAnotherUserPasswordRequestModel = {
  clinicId: string;
  userId: string;
  newPassword: string;
  confirmNewPassword: string;
};

export { ResetAnotherUserPasswordRequestModel };
