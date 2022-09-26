type ConfigureProfessionalRequestModel = {
  userId: string;
  clinicId: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  baseDuration: string;
  weeklySchedule: {
    dayOfTheWeek: string;
    startTime: string;
    endTime: string;
    locks: {
      startTime: string;
      endTime: string;
    }[];
  }[];
};

export { ConfigureProfessionalRequestModel };
