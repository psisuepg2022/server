import { hash as bHash, compare as bCompare } from "bcryptjs";

import { IHashProvider } from "../../models/IHashProvider";

class HashProvider implements IHashProvider {
  hash = async (payload: string, salt: number): Promise<string> =>
    bHash(payload, salt);

  compare = async (payload: string, hashed: string): Promise<boolean> =>
    bCompare(payload, hashed);
}

export { HashProvider };
