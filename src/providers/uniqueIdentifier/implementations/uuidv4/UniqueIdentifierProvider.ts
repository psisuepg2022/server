import { v4 as uuidv4, validate as uuidValidate } from "uuid";

import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier/models/IUniqueIdentifierProvider";

class UniqueIdentifierProvider implements IUniqueIdentifierProvider {
  generate = (): string => uuidv4();

  isValid = (id: string): boolean => uuidValidate(id);
}

export { UniqueIdentifierProvider };
