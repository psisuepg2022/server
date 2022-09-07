import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { CreateCommentRequestModel } from "@models/dto/comments/CreateCommentRequestModel";
import { CreateCommentResponseModel } from "@models/dto/comments/CreateCommentResponseModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IAppointmentRepository } from "@repositories/appointment";

@injectable()
class CreateCommentService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("AppointmentRepository")
    private appointmentRepository: IAppointmentRepository
  ) {}

  public async execute({
    appointmentId,
    professionalId,
    text,
  }: CreateCommentRequestModel): Promise<CreateCommentResponseModel> {
    if (stringIsNullOrEmpty(appointmentId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorAppointmentIdRequired"));

    if (stringIsNullOrEmpty(professionalId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["profissional"])
      );

    if (stringIsNullOrEmpty(text))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorCreateCommentTextRequired")
      );

    if (
      !this.uniqueIdentifierProvider.isValid(appointmentId) ||
      !this.uniqueIdentifierProvider.isValid(professionalId)
    )
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const [hasAppointment] = await transaction([
      this.appointmentRepository.findToUpdateComment(
        appointmentId,
        professionalId
      ),
    ]);

    if (!hasAppointment)
      throw new AppError(
        "NOT_FOUND",
        i18n.__("ErrorCreateCommentAppointmentNotFound")
      );

    return { appointmentId: "", text: "" };
  }
}

export { CreateCommentService };
