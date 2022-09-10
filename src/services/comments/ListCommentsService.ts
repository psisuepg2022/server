import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { ListCommentsRequestModel } from "@models/dto/comments/ListCommentsRequestModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";

@injectable()
class ListCommentsService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider
  ) {}

  public async execute(
    { patientId, professionalId }: ListCommentsRequestModel,
    __: IPaginationOptions
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

    return { items: [], totalItems: 0 };
  }
}

export { ListCommentsService };
