import { IsNumberValidationModel } from "@models/utils/IsNumberValidationModel";

const toNumber = ({ value, error }: IsNumberValidationModel): number => {
  const aux = Number(value);
  if (Number.isNaN(aux)) throw error;
  return aux;
};

export { toNumber };
