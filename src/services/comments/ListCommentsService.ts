import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { pagination } from "@helpers/pagination";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { ListCommentsRequestModel } from "@models/dto/comments/ListCommentsRequestModel";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { ICommentsRepository } from "@repositories/comments";

@injectable()
class ListCommentsService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("CommentsRepository")
    private commentsRepository: ICommentsRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider
  ) {}

  public async execute(
    { patientId, professionalId }: ListCommentsRequestModel,
    { page, size }: IPaginationOptions
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

    const [totalItems, items] = await transaction([
      this.commentsRepository.count(professionalId, patientId),
      this.commentsRepository.get(professionalId, patientId, takeSkip),
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

export { ListCommentsService };
