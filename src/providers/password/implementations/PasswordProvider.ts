import {
  Result as PasswordStrengthResult,
  passwordStrength,
} from "check-password-strength";

import { arraysAreEqual } from "@helpers/arraysAreEqual";

import { IPasswordProvider } from "../models/IPasswordProvider";

class PasswordProvider implements IPasswordProvider {
  readonly MIN_LENGTH: number = 8;

  readonly IS_REQUIRED: string[] = ["lowercase", "uppercase", "number"];

  hasStrength(password: string): boolean {
    const { length, contains, id }: PasswordStrengthResult<number> =
      passwordStrength(password);

    if (length < this.MIN_LENGTH || id === 0) return false;

    return arraysAreEqual<string>(contains, this.IS_REQUIRED);
  }

  generate(): string {
    throw new Error("Method not implemented.");
  }
}

export { PasswordProvider };
