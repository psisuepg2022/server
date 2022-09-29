import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
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
import { IPersonRepository } from "@repositories/person";
import { IScheduleRepository } from "@repositories/schedule";

@injectable()
class ListWeeklyScheduleService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ScheduleRepository")
    private scheduleRepository: IScheduleRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider,
    @inject("PersonRepository")
    private personRepository: IPersonRepository
  ) {}

  public async execute(
    clinicId: string,
    professionalId: string
  ): Promise<ListWeeklyScheduleResponseModel[]> {
    if (stringIsNullOrEmpty(clinicId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorClinicRequired"));

    if (stringIsNullOrEmpty(professionalId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorProfessionalRequired"));

    if (
      !this.uniqueIdentifierProvider.isValid(professionalId) ||
      !this.uniqueIdentifierProvider.isValid(clinicId)
    )
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const [hasProfessional] = await transaction([
      this.personRepository.findActivated(
        clinicId,
        professionalId,
        UserDomainClasses.PROFESSIONAL
      ),
    ]);

    if (!hasProfessional)
      throw new AppError(
        "NOT_FOUND",
        i18n.__mf("ErrorUserIDNotFound", ["profissional"])
      );

    const [schedule] = await transaction([
      this.scheduleRepository.getWeeklySchedule(professionalId),
    ]);

    return Array.from({ length: 7 })
      .fill({})
      .map((_, index: number): ListWeeklyScheduleResponseModel => {
        const hasScheduleIndex = schedule.findIndex(
          ({ dayOfTheWeek }: WeeklyScheduleModel) => dayOfTheWeek === index + 1
        );

        if (hasScheduleIndex >= 0 && hasScheduleIndex < schedule.length)
          return {
            id: schedule[hasScheduleIndex].id,
            dayOfTheWeek: getEnumDescription(
              "DAYS_OF_THE_WEEK",
              DaysOfTheWeek[schedule[hasScheduleIndex].dayOfTheWeek as number]
            ),
            startTime: this.maskProvider.time(
              new Date(schedule[hasScheduleIndex].startTime)
            ),
            endTime: this.maskProvider.time(
              new Date(schedule[hasScheduleIndex].endTime)
            ),
            locks: schedule[hasScheduleIndex].WeeklyScheduleLocks.map(
              (lock: WeeklyScheduleLockModel): WeeklyScheduleLockModel => ({
                ...lock,
                startTime: this.maskProvider.time(new Date(lock.startTime)),
                endTime: this.maskProvider.time(new Date(lock.endTime)),
              })
            ),
          };

        return {
          dayOfTheWeek: getEnumDescription(
            "DAYS_OF_THE_WEEK",
            DaysOfTheWeek[index + 1]
          ),
        } as ListWeeklyScheduleResponseModel;
      });
  }
}

export { ListWeeklyScheduleService };
