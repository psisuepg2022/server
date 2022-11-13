import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { env } from "@helpers/env";
import { normalizeHTML } from "@helpers/normalizeHTML";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { GetPdfOfCommentsRequestModel } from "@models/dto/comments/GetPdfOfCommentsRequestModel";
import { GetPdfOfCommentsObjectToCompileModel } from "@models/utils/GetPdfOfCommentsObjectToCompileModel";
import { IDateProvider } from "@providers/date";
import { IMaskProvider } from "@providers/mask";
import { IPDFProvider } from "@providers/PDFProvider";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IAppointmentRepository } from "@repositories/appointment";

@injectable()
class GetPdfOfCommentsService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("PDFProvider")
    private pdfProvider: IPDFProvider,
    @inject("AppointmentRepository")
    private appointmentRepository: IAppointmentRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider,
    @inject("DateProvider")
    private dateProvider: IDateProvider
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

    const [hasAppointment] = await transaction([
      this.appointmentRepository.getToPdf(appointmentId, professionalId),
    ]);

    if (!hasAppointment)
      throw new AppError(
        "NOT_FOUND",
        i18n.__("ErrorUpdateStatusAppointmentNotFound")
      );

    const html =
      await this.pdfProvider.compile<GetPdfOfCommentsObjectToCompileModel>(
        "comments.ejs",
        {
          clinic: hasAppointment.professional.user.person.clinic.name,
          imageUrl: `${env("BASE_URL")}/assets/${env("SUPPORT_ID")}/logo.png`,
          patient: hasAppointment.patient.person.name,
          professional: hasAppointment.professional.user.person.name,
          content: normalizeHTML(hasAppointment.comments || ""),
          appointment: {
            date: this.maskProvider.date(
              hasAppointment.appointmentDate as Date
            ),
            end: this.maskProvider.time(
              this.dateProvider.addMinutes(
                hasAppointment.appointmentDate as Date,
                hasAppointment.professional.baseDuration
              )
            ),
            start: this.maskProvider.time(
              hasAppointment.appointmentDate as Date
            ),
          },
        }
      );

    return this.pdfProvider.getPDFBuffer(html, {
      border: {
        top: "15mm",
        right: "10mm",
        bottom: "15mm",
        left: "10mm",
      },
    });
  }
}

export { GetPdfOfCommentsService };
