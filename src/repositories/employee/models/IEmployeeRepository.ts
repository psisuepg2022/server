import { EmployeeModel } from "@models/domain/EmployeeModel";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";

interface IEmployeeRepository {
  get(
    clinicId: string,
    [take, skip]: [number, number]
  ): PrismaPromise<Partial<EmployeeModel & { person: PersonModel }>[]>;
}

export { IEmployeeRepository };
