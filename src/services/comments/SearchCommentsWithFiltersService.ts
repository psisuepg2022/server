import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { pagination } from "@helpers/pagination";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { ListCommentsRequestModel } from "@models/dto/comments/ListCommentsRequestModel";
import { SearchCommentsRequestModel } from "@models/dto/comments/SearchCommentsRequestModel";
import { IDateProvider } from "@providers/date";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { ICommentsRepository } from "@repositories/comments";

@injectable()
class SearchCommentsWithFiltersService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("CommentsRepository")
    private commentsRepository: ICommentsRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider,
    @inject("ValidatorsProvider")
    private validatorsProvider: IValidatorsProvider,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  protected getFilters = (
    filters: SearchCommentsRequestModel | null
  ): [Date | null, Date | null] => {
    if (!filters) return [null, null];

    const startDate = ((): Date | null => {
      if (!filters.appointmentDate.start) return null;

      if (!this.validatorsProvider.date(filters.appointmentDate.start))
        throw new AppError(
          "BAD_REQUEST",
          i18n.__("ErrorSearchCommentsStartDateInvalid")
        );

      return this.dateProvider.getUTCDate(
        filters.appointmentDate.start,
        "00:00"
      );
    })();

    const endDate = ((): Date | null => {
      if (!filters.appointmentDate.end) return null;

      if (!this.validatorsProvider.date(filters.appointmentDate.end))
        throw new AppError(
          "BAD_REQUEST",
          i18n.__("ErrorSearchCommentsEndDateInvalid")
        );

      return this.dateProvider.getUTCDate(filters.appointmentDate.end, "23:59");
    })();

    if (startDate && endDate && this.dateProvider.isBefore(endDate, startDate))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorSearchCommentsIntervalInvalid")
      );

    return [startDate, endDate];
  };

  public async execute(
    { patientId, professionalId }: ListCommentsRequestModel,
    { page, size, filters }: IPaginationOptions<SearchCommentsRequestModel>
  ): Promise<IPaginationResponse<ListCommentsResponseModel>> {
    if (stringIsNullOrEmpty(patientId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["paciente"])
      );

    if (stringIsNullOrEmpty(professionalId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["profissional"])
      );

    if (
      !this.uniqueIdentifierProvider.isValid(professionalId) ||
      !this.uniqueIdentifierProvider.isValid(patientId)
    )
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const takeSkip = pagination({ page, size });
    const interval = this.getFilters(filters || null);

    const [totalItems, items] = await transaction([
      this.commentsRepository.count(professionalId, patientId, interval),
      this.commentsRepository.get(
        professionalId,
        patientId,
        takeSkip,
        interval
      ),
    ]);

    return {
      items: items.map(
        ({
          id,
          appointmentDate,
          comments,
          createdAt,
          updatedAt,
        }): ListCommentsResponseModel => ({
          id,
          text: comments,
          appointmentDate: appointmentDate.toISOString(),
          completedAt: this.maskProvider.date(updatedAt),
          scheduledAt: this.maskProvider.date(createdAt),
        })
      ),
      totalItems,
    };
  }
}

export { SearchCommentsWithFiltersService };
