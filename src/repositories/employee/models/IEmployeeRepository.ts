import { EmployeeModel } from "@models/domain/EmployeeModel";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";

interface IEmployeeRepository {
  get([take, skip]: [number, number]): PrismaPromise<
    Partial<EmployeeModel & { person: PersonModel }>[]
  >;
}

export { IEmployeeRepository };
