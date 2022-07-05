import { container } from "tsyringe";

import { HashProvider, IHashProvider } from "@providers/hash";
import { IPasswordProvider, PasswordProvider } from "@providers/password";
import {
  IUniqueIdentifierProvider,
  UniqueIdentifierProvider,
} from "@providers/uniqueIdentifier";

container.registerSingleton<IUniqueIdentifierProvider>(
  "UniqueIdentifierProvider",
  UniqueIdentifierProvider
);

container.registerSingleton<IPasswordProvider>(
  "PasswordProvider",
  PasswordProvider
);

container.registerSingleton<IHashProvider>("HashProvider", HashProvider);
