import { UserDomainClasses } from "@common/UserDomainClasses";
import { prismaClient } from "@infra/database/client";
import { AddressModel } from "@models/domain/AddressModel";
import { EmployeeModel } from "@models/domain/EmployeeModel";
import { PersonModel } from "@models/domain/PersonModel";
import { UserModel } from "@models/domain/UserModel";
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
      EmployeeModel & { person: PersonModel & { address: AddressModel } }
    >[]
  > =>
    this.prisma.user.findMany({
      select: {
        accessCode: true,
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
        EmployeeModel & { person: PersonModel & { address: AddressModel } }
      >[]
    >;

  public getToUpdate = (
    clinicId: string,
    id: string
  ): PrismaPromise<
    | (Partial<UserModel> & {
        person: Partial<PersonModel> & { address: AddressModel };
      })
    | null
  > =>
    this.prisma.user.findFirst({
      where: {
        id,
        person: {
          clinicId,
          active: true,
          domainClass: UserDomainClasses.EMPLOYEE,
        },
      },
      select: {
        userName: true,
        person: {
          select: {
            birthDate: true,
            contactNumber: true,
            CPF: true,
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
          },
        },
      },
    }) as PrismaPromise<
      | (Partial<UserModel> & {
          person: Partial<PersonModel> & { address: AddressModel };
        })
      | null
    >;
}

export { EmployeeRepository };
