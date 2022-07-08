import { container } from "tsyringe";

import { HashProvider, IHashProvider } from "@providers/hash";
import { IPasswordProvider, PasswordProvider } from "@providers/password";
import {
  IUniqueIdentifierProvider,
  UniqueIdentifierProvider,
} from "@providers/uniqueIdentifier";
import { IValidatorsProvider, ValidatorsProvider } from "@providers/validators";

container.registerSingleton<IUniqueIdentifierProvider>(
  "UniqueIdentifierProvider",
  UniqueIdentifierProvider
);

container.registerSingleton<IPasswordProvider>(
  "PasswordProvider",
  PasswordProvider
);

container.registerSingleton<IHashProvider>("HashProvider", HashProvider);

container.registerSingleton<IValidatorsProvider>(
  "ValidatorsProvider",
  ValidatorsProvider
);
