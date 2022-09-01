type GetCalendarRequestModel = {
  professionalId: string;
  clinicId: string;
  startDate: string | null;
  endDate: string | null;
  returnWeeklySchedule: boolean;
};

export { GetCalendarRequestModel };
