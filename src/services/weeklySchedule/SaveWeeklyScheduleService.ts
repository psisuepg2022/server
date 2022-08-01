import { SaveWeeklyScheduleRequestModel } from "@models/dto/weeklySchedule/SaveWeeklyScheduleRequestModel";

class SaveWeeklyScheduleService {
  public async execute(_: SaveWeeklyScheduleRequestModel): Promise<any> {
    return {};
  }
}

export { SaveWeeklyScheduleService };
