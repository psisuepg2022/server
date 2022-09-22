import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { AppointmentModel } from "@models/domain/AppointmentModel";
import { GetAppointmentCommentsRequestModel } from "@models/dto/comments/GetAppointmentCommentsRequestModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";

@injectable()
class GetAppointmentService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider
  ) {}

  public async execute({
    appointmentId,
    professionalId,
  }: GetAppointmentCommentsRequestModel): Promise<AppointmentModel> {
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

    return {} as AppointmentModel;
  }
}

export { GetAppointmentService };
