import { DisableWeeklyScheduleDayRequestModel } from "@models/dto/weeklySchedule/DisableWeeklyScheduleDayRequestModel";

class DisableWeeklyScheduleDayService {
  public async execute(
    _: DisableWeeklyScheduleDayRequestModel
  ): Promise<boolean> {
    return true;
  }
}

export { DisableWeeklyScheduleDayService };
