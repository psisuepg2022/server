import { container } from "tsyringe";

import { ClinicRepository, IClinicRepository } from "@repositories/clinic";
import { IPersonRepository } from "@repositories/person";
import { PersonRepository } from "@repositories/person/implementations/PostgreSQL/Prisma/PersonRepository";

container.registerSingleton<IClinicRepository>(
  "ClinicRepository",
  ClinicRepository
);

container.registerSingleton<IPersonRepository>(
  "PersonRepository",
  PersonRepository
);
