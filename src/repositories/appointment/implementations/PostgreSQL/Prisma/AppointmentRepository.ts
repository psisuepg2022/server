import { IAppointmentRepository } from "@repositories/appointment/models/IAppointmentRepository";

class AppointmentRepository implements IAppointmentRepository {
  save(): any {
    throw new Error("Method not implemented.");
  }
}

export { AppointmentRepository };
