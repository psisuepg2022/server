import { AppointmentStatus } from "@infra/domains";

type AppointmentModel = {
  id: string;
  updatedAt: Date;
  createdAt: Date;
  comments: string | null;
  appointmentDate: Date;
  status: AppointmentStatus;
};

export { AppointmentModel };
