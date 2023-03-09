import { UserDomainClasses } from "@common/UserDomainClasses";
import { prismaClient } from "@infra/database/client";
import { AddressModel } from "@models/domain/AddressModel";
import { EmployeeModel } from "@models/domain/EmployeeModel";
import { PersonModel } from "@models/domain/PersonModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IEmployeeRepository } from "@repositories/employee/models/IEmployeeRepository";
import { clause2searchPeopleWithFilters } from "@repositories/person";

class EmployeeRepository implements IEmployeeRepository {
  constructor(private prisma = prismaClient) {}

  public get = (
    clinicId: string,
    [take, skip]: [number, number],
    filters: SearchPersonRequestModel | null
  ): PrismaPromise<
    Partial<
      EmployeeModel & {
        person: PersonModel & {
          address: AddressModel;
          clinic: { code: number };
        };
      }
    >[]
  > =>
    this.prisma.user.findMany({
      select: {
        id: true,
        userName: true,
        person: {
          select: {
            id: true,
            birthDate: true,
            CPF: true,
            contactNumber: true,
            email: true,
            name: true,
            address: {
              select: {
                id: true,
                city: true,
                district: true,
                state: true,
                publicArea: true,
                zipCode: true,
              },
            },
            clinic: { select: { code: true } },
          },
        },
      },
      where: {
        person: {
          domainClass: UserDomainClasses.EMPLOYEE,
          active: true,
          clinicId,
          AND: clause2searchPeopleWithFilters(filters),
        },
      },
      orderBy: { person: { name: "asc" } },
      take,
      skip,
    }) as PrismaPromise<
      Partial<
        EmployeeModel & {
          person: PersonModel & {
            address: AddressModel;
            clinic: { code: number };
          };
        }
      >[]
    >;
}

export { EmployeeRepository };
