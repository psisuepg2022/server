import { UpdateStatusRequestModel } from "@models/dto/appointment/UpdateStatusRequestModel";
import { AppointmentOnCalendarModel } from "@models/dto/calendar/AppointmentOnCalendarModel";

class UpdateStatusService {
  public async execute(
    _: UpdateStatusRequestModel
  ): Promise<AppointmentOnCalendarModel> {
    return {} as AppointmentOnCalendarModel;
  }
}

export { UpdateStatusService };
