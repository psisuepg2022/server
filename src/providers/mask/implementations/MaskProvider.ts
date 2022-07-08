import { IMaskProvider } from "../models/IMaskProvider";

class MaskProvider implements IMaskProvider {
  remove = (value: string): string => value.replace(/[^0-9]+/g, "");
}

export { MaskProvider };
