import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { getEnumDescription } from "@helpers/getEnumDescription";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { DaysOfTheWeek } from "@infra/domains";
import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";
import { WeeklyScheduleModel } from "@models/domain/WeeklyScheduleModel";
import { ListWeeklyScheduleResponseModel } from "@models/dto/weeklySchedule/ListWeeklyScheduleResponseModel";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IScheduleRepository } from "@repositories/schedule";

@injectable()
class ListWeeklyScheduleService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ScheduleRepository")
    private scheduleRepository: IScheduleRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider
  ) {}

  public async execute(
    professionalId: string
  ): Promise<ListWeeklyScheduleResponseModel[]> {
    if (stringIsNullOrEmpty(professionalId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorProfessionalRequired"));

    if (!this.uniqueIdentifierProvider.isValid(professionalId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const [schedule] = await transaction([
      this.scheduleRepository.getWeeklySchedule(professionalId),
    ]);

    return schedule.map(
      (
        item: WeeklyScheduleModel & {
          WeeklyScheduleLocks: WeeklyScheduleLockModel[];
        }
      ): ListWeeklyScheduleResponseModel => ({
        ...item,
        dayOfTheWeek: getEnumDescription(
          "DAYS_OF_THE_WEEK",
          DaysOfTheWeek[item.dayOfTheWeek as number]
        ),
        startTime: this.maskProvider.time(new Date(item.startTime)),
        endTime: this.maskProvider.time(new Date(item.endTime)),
        WeeklyScheduleLocks: item.WeeklyScheduleLocks.map(
          (lock: WeeklyScheduleLockModel): WeeklyScheduleLockModel => ({
            ...lock,
            startTime: this.maskProvider.time(new Date(lock.startTime)),
            endTime: this.maskProvider.time(new Date(lock.endTime)),
          })
        ),
      })
    );
  }
}

export { ListWeeklyScheduleService };
