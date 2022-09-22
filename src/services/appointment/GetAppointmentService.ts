import { AppointmentModel } from "@models/domain/AppointmentModel";
import { GetAppointmentCommentsRequestModel } from "@models/dto/comments/GetAppointmentCommentsRequestModel";

class GetAppointmentService {
  public async execute(
    _: GetAppointmentCommentsRequestModel
  ): Promise<AppointmentModel> {
    return {} as AppointmentModel;
  }
}

export { GetAppointmentService };
