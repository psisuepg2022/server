import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { validate } from "email-validator";

import { IValidatorsProvider } from "../models/IValidatorsProvider";

class ValidatorsProvider implements IValidatorsProvider {
  cpf = (cpf: string): boolean => cpfValidator.isValid(cpf);

  email = (email: string): boolean => validate(email);

  contactNumber = (contactNumber: string): boolean =>
    !(
      contactNumber.length !== 15 ||
      "/^(?:()[0-9]{2}(?:))s?[0-9]{4,5}(?:-)[0-9]{4}$/".match(contactNumber)
    );
}

export { ValidatorsProvider };
