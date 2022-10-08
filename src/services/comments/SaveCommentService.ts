import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { getEnumDescription } from "@helpers/getEnumDescription";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { AppointmentStatus } from "@infra/domains";
import { SaveCommentRequestModel } from "@models/dto/comments/SaveCommentRequestModel";
import { SaveCommentResponseModel } from "@models/dto/comments/SaveCommentResponseModel";
import { IDateProvider } from "@providers/date";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IAppointmentRepository } from "@repositories/appointment";
import { ICommentsRepository } from "@repositories/comments";

@injectable()
class SaveCommentService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("AppointmentRepository")
    private appointmentRepository: IAppointmentRepository,
    @inject("CommentsRepository")
    private commentsRepository: ICommentsRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  public async execute({
    appointmentId,
    professionalId,
    text,
    blankComments,
  }: SaveCommentRequestModel): Promise<SaveCommentResponseModel> {
    if (stringIsNullOrEmpty(appointmentId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorAppointmentIdRequired"));

    if (stringIsNullOrEmpty(professionalId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["profissional"])
      );

    if (
      !this.uniqueIdentifierProvider.isValid(appointmentId) ||
      !this.uniqueIdentifierProvider.isValid(professionalId)
    )
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    if (!blankComments && stringIsNullOrEmpty(text))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorCreateCommentTextRequired")
      );

    // TODO: text validation

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

    const updatedAt = this.dateProvider.now();

    const [savedComment, updatedStatus] = await transaction([
      this.commentsRepository.save(
        appointmentId,
        blankComments ? null : text,
        updatedAt
      ),
      this.appointmentRepository.updateStatus(
        appointmentId,
        AppointmentStatus.COMPLETED,
        updatedAt
      ),
    ]);

    return {
      appointmentId: savedComment.id,
      text: savedComment.comments || "",
      updatedAt: savedComment.updatedAt.toISOString(),
      status: getEnumDescription(
        "APPOINTMENT_STATUS",
        AppointmentStatus[updatedStatus.status as number]
      ),
    };
  }
}

export { SaveCommentService };
