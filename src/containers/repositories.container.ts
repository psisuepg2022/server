import { container } from "tsyringe";

import { AddressRepository, IAddressRepository } from "@repositories/address";
import {
  AppointmentRepository,
  IAppointmentRepository,
} from "@repositories/appointment";
import {
  AuthenticationRepository,
  IAuthenticationRepository,
} from "@repositories/authentication";
import { ClinicRepository, IClinicRepository } from "@repositories/clinic";
import {
  EmployeeRepository,
  IEmployeeRepository,
} from "@repositories/employee";
import { ILiableRepository } from "@repositories/liable";
import { LiableRepository } from "@repositories/liable/implementations/PostgreSQL/Prisma/LiableRepository";
import { IOwnerRepository, OwnerRepository } from "@repositories/owner";
import { IPatientRepository, PatientRepository } from "@repositories/patient";
import { IPersonRepository, PersonRepository } from "@repositories/person";
import {
  IProfessionalRepository,
  ProfessionalRepository,
} from "@repositories/professional";
import {
  IScheduleRepository,
  ScheduleRepository,
} from "@repositories/schedule";
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

container.registerSingleton<IEmployeeRepository>(
  "EmployeeRepository",
  EmployeeRepository
);

container.registerSingleton<IPatientRepository>(
  "PatientRepository",
  PatientRepository
);

container.registerSingleton<IOwnerRepository>(
  "OwnerRepository",
  OwnerRepository
);

container.registerSingleton<ILiableRepository>(
  "LiableRepository",
  LiableRepository
);

container.registerSingleton<IProfessionalRepository>(
  "ProfessionalRepository",
  ProfessionalRepository
);

container.registerSingleton<IScheduleRepository>(
  "ScheduleRepository",
  ScheduleRepository
);

container.registerSingleton<IAppointmentRepository>(
  "AppointmentRepository",
  AppointmentRepository
);
