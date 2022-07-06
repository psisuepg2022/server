import {
  Result as PasswordStrengthResult,
  passwordStrength,
} from "check-password-strength";

import { arraysAreEqual } from "@helpers/arraysAreEqual";

import { IPasswordProvider } from "../models/IPasswordProvider";

class PasswordProvider implements IPasswordProvider {
  readonly MIN_LENGTH: number = 8;

  readonly MAX_LENGTH: number = 32;

  readonly IS_REQUIRED: string[] = ["lowercase", "uppercase", "number"];

  outOfBounds = (password: string): boolean =>
    password.length < this.MIN_LENGTH || password.length > this.MAX_LENGTH;

  hasStrength(password: string): boolean {
    const { contains, id }: PasswordStrengthResult<number> =
      passwordStrength(password);

    if (id === 0) return false;

    return arraysAreEqual<string>(contains, this.IS_REQUIRED);
  }

  generate(): string {
    throw new Error("Method not implemented.");
  }
}

export { PasswordProvider };
