import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { getEnumDescription } from "@helpers/getEnumDescription";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { toNumber } from "@helpers/toNumber";
import { transaction } from "@infra/database/transaction";
import { DaysOfTheWeek } from "@infra/domains";
import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";
import { ConfigureProfessionalRequestModel } from "@models/dto/professional/ConfigureProfessionalRequestModel";
import { ConfigureWeeklyScheduleLocksRequestModel } from "@models/dto/weeklySchedule/ConfigureWeeklyScheduleRequestModel";
import { CreateWeeklyScheduleLockRequestModel } from "@models/dto/weeklySchedule/CreateWeeklyScheduleLockRequestModel";
import { PrismaPromise, WeeklySchedule } from "@prisma/client";
import { IDateProvider } from "@providers/date";
import { IPasswordProvider } from "@providers/password";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IProfessionalRepository } from "@repositories/professional";

@injectable()
class ConfigureProfessionalService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ProfessionalRepository")
    private professionalRepository: IProfessionalRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("PasswordProvider")
    private passwordProvider: IPasswordProvider,
    @inject("ValidatorsProvider")
    private validatorsProvider: IValidatorsProvider
  ) {}

  private validateInterval = (
    start: string,
    end: string,
    index: number,
    dayOfTheWeek: string,
    type: "weekly_schedule" | "lock"
  ): void => {
    this.validateTime(start, index, dayOfTheWeek, type, "Start");
    this.validateTime(end, index, dayOfTheWeek, type, "End");

    if (this.dateProvider.time2date(start) > this.dateProvider.time2date(end))
      throw new AppError(
        "BAD_REQUEST",
        type === "lock"
          ? i18n.__mf("ErrorConfigureProfessionalWeeklyLockIntervalInvalid", [
              index + 1,
              dayOfTheWeek,
            ])
          : i18n.__mf("ErrorConfigureProfessionalWeeklyIntervalInvalid", [
              dayOfTheWeek,
            ])
      );
  };

  private validateTime = (
    time: string,
    index: number,
    dayOfTheWeek: string,
    type: "weekly_schedule" | "lock",
    label: "Start" | "End"
  ): void => {
    if (stringIsNullOrEmpty(time))
      throw new AppError(
        "BAD_REQUEST",
        type === "lock"
          ? i18n.__mf(
              `ErrorConfigureProfessionalWeeklyLock${label}TimeRequired`,
              [index + 1, dayOfTheWeek]
            )
          : i18n.__mf(`ErrorConfigureProfessionalWeekly${label}TimeRequired`, [
              dayOfTheWeek,
            ])
      );

    if (!this.validatorsProvider.time(time))
      throw new AppError(
        "BAD_REQUEST",
        type === "lock"
          ? i18n.__mf(
              `ErrorConfigureProfessionalWeeklyLock${label}TimeInvalid`,
              [index + 1, dayOfTheWeek]
            )
          : i18n.__mf(`ErrorConfigureProfessionalWeekly${label}TimeInvalid`, [
              dayOfTheWeek,
            ])
      );
  };

  private validateIntervalOutOfBounds = (
    start: Date,
    end: Date,
    toCompare: number,
    dayOfTheWeek: string,
    index: number,
    type: "weekly_schedule" | "lock"
  ): void => {
    if (
      (this.dateProvider.differenceInMillis(end, start) /
        this.dateProvider.minuteToMilli(toCompare)) %
      2
    )
      throw new AppError(
        "BAD_REQUEST",
        type === "lock"
          ? i18n.__mf(
              "ErrorConfigureProfessionalWeeklyLockIntervalOutOfBounds",
              [index + 1, dayOfTheWeek, toCompare]
            )
          : i18n.__mf("ErrorConfigureProfessionalWeeklyIntervalOutOfBounds", [
              dayOfTheWeek,
              toCompare,
            ])
      );
  };

  public async execute({
    userId,
    clinicId,
    baseDuration,
    confirmNewPassword,
    newPassword,
    oldPassword,
    weeklySchedule,
  }: ConfigureProfessionalRequestModel): Promise<void> {
    if (stringIsNullOrEmpty(userId))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", ["profissional"])
      );

    if (!this.uniqueIdentifierProvider.isValid(userId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    if (stringIsNullOrEmpty(baseDuration))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorBaseDurationRequired"));

    const baseDurationConverted = toNumber({
      value: baseDuration,
      error: new AppError("BAD_REQUEST", i18n.__("ErrorBaseDurationInvalid")),
    });

    if (stringIsNullOrEmpty(oldPassword))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorResetPasswdOldPasswordRequired")
      );

    if (stringIsNullOrEmpty(newPassword))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorResetPasswdNewPasswordRequired")
      );

    if (stringIsNullOrEmpty(confirmNewPassword))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorResetPasswdConfirmNewPasswordRequired")
      );

    if (newPassword !== confirmNewPassword)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorResetPasswdNewPasswordAndConfirmAreNotEqual")
      );

    if (this.passwordProvider.outOfBounds(newPassword))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorPasswordOutOfBounds", [
          this.passwordProvider.MIN_LENGTH,
          this.passwordProvider.MAX_LENGTH,
        ])
      );

    if (!this.passwordProvider.hasStrength(newPassword))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorPasswordToWeak"));

    if (!weeklySchedule || !Array.isArray(weeklySchedule))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorConfigureProfessionalWeeklyScheduleRequired")
      );

    const createWeeklyScheduleOperations: PrismaPromise<WeeklySchedule>[] = [];
    const createLocksOperations: PrismaPromise<WeeklyScheduleLockModel>[] = [];

    if (weeklySchedule.length > 7)
      throw new AppError(
        "BAD_REQUEST",
        i18n.__("ErrorConfigureProfessionalWeeklyMoreThanOneWeek")
      );

    if (weeklySchedule.length > 0)
      weeklySchedule.forEach(
        (
          {
            startTime,
            endTime,
            dayOfTheWeek,
            locks,
          }: ConfigureWeeklyScheduleLocksRequestModel,
          indexWeeklySchedule: number
        ): void => {
          if (
            weeklySchedule.filter((item) => item.dayOfTheWeek === dayOfTheWeek)
              .length !== 1
          )
            throw new AppError(
              "BAD_REQUEST",
              i18n.__("ErrorConfigureProfessionalDuplicateDayOfTheWeek")
            );

          if (stringIsNullOrEmpty(dayOfTheWeek))
            throw new AppError(
              "BAD_REQUEST",
              i18n.__mf("ErrorConfigureProfessionalDayOfTheWeekRequired", [
                indexWeeklySchedule + 1,
              ])
            );

          const dayOfTheWeekConverted = toNumber({
            value: dayOfTheWeek,
            error: new AppError(
              "BAD_REQUEST",
              i18n.__mf("ErrorConfigureProfessionalDayOfTheWeekInvalid", [
                indexWeeklySchedule + 1,
              ])
            ),
          });

          if (!(dayOfTheWeekConverted in DaysOfTheWeek))
            throw new AppError(
              "BAD_REQUEST",
              i18n.__mf("ErrorConfigureProfessionalDayOfTheWeekInvalid", [
                indexWeeklySchedule + 1,
              ])
            );

          const descriptionDayOfTheWeek = getEnumDescription(
            "DAYS_OF_THE_WEEK",
            DaysOfTheWeek[dayOfTheWeekConverted]
          );

          this.validateInterval(
            startTime,
            endTime,
            indexWeeklySchedule,
            descriptionDayOfTheWeek,
            "weekly_schedule"
          );

          const endTimeConverted = this.dateProvider.time2date(endTime);
          const startTimeConverted = this.dateProvider.time2date(startTime);

          this.validateIntervalOutOfBounds(
            startTimeConverted,
            endTimeConverted,
            baseDurationConverted,
            descriptionDayOfTheWeek,
            indexWeeklySchedule,
            "weekly_schedule"
          );

          if (Array.isArray(locks) && locks.length > 0)
            locks.forEach(
              (
                lock: CreateWeeklyScheduleLockRequestModel,
                indexLocks: number
              ): void => {
                this.validateInterval(
                  lock.startTime,
                  lock.endTime,
                  indexLocks,
                  descriptionDayOfTheWeek,
                  "lock"
                );

                const lockStartTimeConverted = this.dateProvider.time2date(
                  lock.startTime
                );
                const lockEndTimeConverted = this.dateProvider.time2date(
                  lock.endTime
                );

                this.validateIntervalOutOfBounds(
                  lockStartTimeConverted,
                  lockEndTimeConverted,
                  baseDurationConverted,
                  descriptionDayOfTheWeek,
                  indexLocks,
                  "lock"
                );

                createLocksOperations.push();
              }
            );

          createWeeklyScheduleOperations.push();
        }
      );

    const [hasProfessional] = await transaction([
      this.professionalRepository.getToConfigure(clinicId, userId),
    ]);

    if (!hasProfessional)
      throw new AppError(
        "NOT_FOUND",
        i18n.__mf("ErrorUserIDNotFound", ["profissional"])
      );
  }
}

export { ConfigureProfessionalService };
