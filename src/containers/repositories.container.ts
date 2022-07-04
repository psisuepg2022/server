import { container } from "tsyringe";

import { ClinicRepository, IClinicRepository } from "@repositories/clinic";

container.registerSingleton<IClinicRepository>(
  "ClinicRepository",
  ClinicRepository
);
