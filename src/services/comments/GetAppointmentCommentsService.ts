import { GetAppointmentCommentsRequestModel } from "@models/dto/comments/GetAppointmentCommentsRequestModel";
import { GetAppointmentCommentsResponseModel } from "@models/dto/comments/GetAppointmentCommentsResponseModel";

class GetAppointmentCommentsService {
  public async execute(
    _: GetAppointmentCommentsRequestModel
  ): Promise<GetAppointmentCommentsResponseModel> {
    return {} as GetAppointmentCommentsResponseModel;
  }
}

export { GetAppointmentCommentsService };
