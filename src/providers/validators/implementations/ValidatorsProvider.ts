import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { validate } from "email-validator";

import { IValidatorsProvider } from "../models/IValidatorsProvider";

class ValidatorsProvider implements IValidatorsProvider {
  cpf = (cpf: string): boolean => cpfValidator.isValid(cpf);

  email = (email: string): boolean => validate(email);

  time = (time: string): boolean => /^[0-9]{2}(?::)[0-9]{2}$/.test(time);

  zipCode = (zipCode: string): boolean =>
    /^[0-9]{5}(?:-)[0-9]{3}/.test(zipCode);

  contactNumber = (contactNumber: string): boolean =>
    /^(?:\()[0-9]{2}(?:\))\s?[0-9]{4,5}(?:-)[0-9]{4}$/.test(contactNumber);
}

export { ValidatorsProvider };
