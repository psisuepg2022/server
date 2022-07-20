import { UserDomainClasses } from "@common/UserDomainClasses";
import { prismaClient } from "@infra/database/client";
import { EmployeeModel } from "@models/domain/EmployeeModel";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";
import { IEmployeeRepository } from "@repositories/employee/models/IEmployeeRepository";

class EmployeeRepository implements IEmployeeRepository {
  constructor(private prisma = prismaClient) {}

  public count = (): PrismaPromise<number> =>
    this.prisma.user.count({
      where: {
        person: {
          domainClass: UserDomainClasses.EMPLOYEE,
          active: true,
        },
      },
    });

  public get = ([take, skip]: [number, number]): PrismaPromise<
    Partial<EmployeeModel & { person: PersonModel }>[]
  > =>
    this.prisma.user.findMany({
      select: {
        accessCode: true,
        id: true,
        userName: true,
        person: {
          select: {
            birthDate: true,
            CPF: true,
            contactNumber: true,
            email: true,
            name: true,
          },
        },
      },
      where: {
        person: { domainClass: UserDomainClasses.EMPLOYEE, active: true },
      },
      orderBy: { person: { name: "asc" } },
      take,
      skip,
    }) as PrismaPromise<Partial<EmployeeModel & { person: PersonModel }>[]>;
}

export { EmployeeRepository };
