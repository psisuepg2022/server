import { container } from "tsyringe";

import { AddressRepository, IAddressRepository } from "@repositories/address";
import {
  AuthenticationRepository,
  IAuthenticationRepository,
} from "@repositories/authentication";
import { ClinicRepository, IClinicRepository } from "@repositories/clinic";
import { IPersonRepository, PersonRepository } from "@repositories/person";
import { IUserRepository, UserRepository } from "@repositories/user";

container.registerSingleton<IClinicRepository>(
  "ClinicRepository",
  ClinicRepository
);

container.registerSingleton<IPersonRepository>(
  "PersonRepository",
  PersonRepository
);

container.registerSingleton<IUserRepository>("UserRepository", UserRepository);

container.registerSingleton<IAuthenticationRepository>(
  "AuthenticationRepository",
  AuthenticationRepository
);

container.registerSingleton<IAddressRepository>(
  "AddressRepository",
  AddressRepository
);
