import { IMaskProvider } from "../models/IMaskProvider";

class MaskProvider implements IMaskProvider {
  zipCode = (zipCode: string): string =>
    zipCode.replace(/[^\d]/g, "").replace(/(\d{5})(\d{3})/, "$1-$2");

  cpf = (cpf: string): string =>
    cpf
      .replace(/[^\d]/g, "")
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

  contactNumber = (contactNumber: string): string =>
    contactNumber
      .replace(/[^\d]/g, "")
      .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");

  date = (date: Date): string =>
    date.toISOString().split("T")[0].split("-").reverse().join("/");

  remove = (value: string): string => value.replace(/[^0-9]+/g, "");
}

export { MaskProvider };
