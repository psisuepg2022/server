import fs from "fs";
import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
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

    const header =
      await this.pdfProvider.compile<GetPdfOfCommentsObjectToCompileModel>(
        "comments/header.ejs",
        {
          clinic: hasAppointment.professional.user.person.clinic.name,
          image: fs
            .readFileSync(`${__dirname}/../../../assets/logo.png`)
            .toString("base64"),
          patient: hasAppointment.patient.person.name,
          professional: hasAppointment.professional.user.person.name,
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

    const footer = await this.pdfProvider.compile("comments/footer.ejs", {});

    return this.pdfProvider.getPDFBuffer(
      normalizeHTML(hasAppointment.comments || ""),
      {
        margin: { top: "50px", right: "50px", bottom: "50px", left: "50px" },
        printBackground: true,
        format: "A4",
        displayHeaderFooter: true,
        headerTemplate: header,
        footerTemplate: footer,
      }
    );
  }
}

export { GetPdfOfCommentsService };
