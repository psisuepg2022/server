import { AppError } from "@handlers/error/AppError";

type IsNumberValidationModel = {
  value: any;
  error: AppError;
};

export { IsNumberValidationModel };
