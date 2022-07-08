import { container } from "tsyringe";

import { ClinicRepository, IClinicRepository } from "@repositories/clinic";
import { IPersonRepository, PersonRepository } from "@repositories/person";

container.registerSingleton<IClinicRepository>(
  "ClinicRepository",
  ClinicRepository
);

container.registerSingleton<IPersonRepository>(
  "PersonRepository",
  PersonRepository
);
