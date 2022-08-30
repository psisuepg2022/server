import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { GetCalendarRequestModel } from "@models/dto/calendar/GetCalendarRequestModel";
import { GetCalendarResponseModel } from "@models/dto/calendar/GetCalendarResponseModel";
import { IDateProvider } from "@providers/date";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IProfessionalRepository } from "@repositories/professional";

@injectable()
class GetCalendarService {
  constructor(
    @inject("ValidatorsProvider")
    private validatorsProvider: IValidatorsProvider,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ProfessionalRepository")
    private professionalRepository: IProfessionalRepository
  ) {}

  public async execute({
    endDate,
    startDate,
    professionalId,
    clinicId,
  }: GetCalendarRequestModel): Promise<GetCalendarResponseModel> {
    if (stringIsNullOrEmpty(professionalId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["profissional"])
      );

    if (!this.uniqueIdentifierProvider.isValid(professionalId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const [startWeek, endWeek] = this.dateProvider.getCurrentWeek();

    const startDateConverted = ((): Date => {
      if (stringIsNullOrEmpty(startDate)) return startWeek;

      if (!this.validatorsProvider.date(startDate || ""))
        throw new AppError(
          "BAD_REQUEST",
          i18n.__("ErrorCalendarStarDateInvalid")
        );

      return this.dateProvider.getUTCDate(startDate as string);
    })();

    const endDateConverted = ((): Date => {
      if (stringIsNullOrEmpty(endDate)) return endWeek;

      if (!this.validatorsProvider.date(endDate || ""))
        throw new AppError(
          "BAD_REQUEST",
          i18n.__("ErrorCalendarEndDateInvalid")
        );

      return this.dateProvider.getUTCDate(endDate as string);
    })();

    if (this.dateProvider.isAfter(startDateConverted, endDateConverted))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorCalendarIntervalInvalid")
      );

    if (
      this.dateProvider.differenceInDays(endDateConverted, startDateConverted) >
      30
    )
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorCalendarSearchIntervalTooLarge", ["30"])
      );

    const [hasProfessional] = await transaction([
      this.professionalRepository.getBaseDuration(clinicId, professionalId),
    ]);

    if (!hasProfessional)
      throw new AppError(
        "NOT_FOUND",
        i18n.__mf("ErrorUserIDNotFound", ["profissional"])
      );

    return {} as GetCalendarResponseModel;
  }
}

export { GetCalendarService };
