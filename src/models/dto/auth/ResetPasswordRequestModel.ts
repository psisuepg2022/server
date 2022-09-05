type ResetPasswordRequestModel = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  clinicId: string;
  userId: string;
};

export { ResetPasswordRequestModel };
