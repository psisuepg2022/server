import { container } from "tsyringe";

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
