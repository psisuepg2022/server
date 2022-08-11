import { AppointmentStatus } from "@infra/domains";

type AppointmentModel = {
  id: string;
  updatedAt: Date;
  createdAt: Date;
  comments?: string;
  appointmentDate: Date;
  status: AppointmentStatus;
};

export { AppointmentModel };
