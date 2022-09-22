import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { getEnumDescription } from "@helpers/getEnumDescription";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { AppointmentStatus } from "@infra/domains";
import { GetAppointmentRequestModel } from "@models/dto/appointment/GetAppointmentRequestModel";
import { GetAppointmentResponseModel } from "@models/dto/appointment/GetAppointmentResponseModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IAppointmentRepository } from "@repositories/appointment";

@injectable()
class GetAppointmentService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("AppointmentRepository")
    private appointmentRepository: IAppointmentRepository
  ) {}

  public async execute({
    appointmentId,
    professionalId,
  }: GetAppointmentRequestModel): Promise<GetAppointmentResponseModel> {
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

    const [appointment] = await transaction([
      this.appointmentRepository.getById(professionalId, appointmentId),
    ]);

    if (!appointment)
      throw new AppError("NOT_FOUND", i18n.__("ErrorAppointmentIdNotFound"));

    return {
      id: appointment?.id || "",
      status: getEnumDescription(
        "APPOINTMENT_STATUS",
        AppointmentStatus[appointment?.status as number]
      ),
      updatedAt: appointment?.updatedAt.toISOString() || "",
      comments: appointment?.comments || undefined,
    };
  }
}

export { GetAppointmentService };
