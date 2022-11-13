import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { GetPdfOfCommentsRequestModel } from "@models/dto/comments/GetPdfOfCommentsRequestModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";

@injectable()
class GetPdfOfCommentsService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider
  ) {}

  public async execute({
    appointmentId,
    professionalId,
  }: GetPdfOfCommentsRequestModel): Promise<Buffer> {
    if (stringIsNullOrEmpty(professionalId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["profissional"])
      );

    if (stringIsNullOrEmpty(appointmentId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorAppointmentIdRequired"));

    if (
      !this.uniqueIdentifierProvider.isValid(professionalId) ||
      !this.uniqueIdentifierProvider.isValid(appointmentId)
    )
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    return Buffer.from("");
  }
}

export { GetPdfOfCommentsService };
