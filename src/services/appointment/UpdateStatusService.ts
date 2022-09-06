import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { toNumber } from "@helpers/toNumber";
import { AppointmentStatus } from "@infra/domains";
import { UpdateStatusRequestModel } from "@models/dto/appointment/UpdateStatusRequestModel";
import { AppointmentOnCalendarModel } from "@models/dto/calendar/AppointmentOnCalendarModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";

@injectable()
class UpdateStatusService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider
  ) {}

  public async execute({
    id,
    status,
  }: UpdateStatusRequestModel): Promise<AppointmentOnCalendarModel> {
    if (stringIsNullOrEmpty(id))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUpdateStatusIdRequired"));

    if (!this.uniqueIdentifierProvider.isValid(id))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    if (stringIsNullOrEmpty(status))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorUpdateStatusStatusRequired")
      );

    const statusConverted = toNumber({
      value: status,
      error: new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorUpdateStatusDomainConvertionInvalid")
      ),
    });

    if (!(statusConverted in AppointmentStatus))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorValueOutOfAppointmentStatusDomain")
      );

    return {} as AppointmentOnCalendarModel;
  }
}

export { UpdateStatusService };
