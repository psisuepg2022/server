import { UserDomainClasses } from "@common/UserDomainClasses";
import { prismaClient } from "@infra/database/client";
import { PersonModel } from "@models/domain/PersonModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IPersonRepository } from "@repositories/person/models/IPersonRepository";

class PersonRepository implements IPersonRepository {
  constructor(private prisma = prismaClient) {}

  public save = (
    clinicId: string,
    { CPF, birthDate, contactNumber, email, domainClass, id, name }: PersonModel
  ): PrismaPromise<Partial<PersonModel>> =>
    this.prisma.person.create({
      data: {
        birthDate,
        CPF,
        id,
        name,
        domainClass,
        contactNumber,
        email,
        clinicId,
      },
      select: {
        birthDate: true,
        CPF: true,
        contactNumber: true,
        email: true,
        name: true,
      },
    }) as PrismaPromise<Partial<PersonModel>>;

  public hasEmail = (email: string): PrismaPromise<PersonModel | null> =>
    this.prisma.person.findFirst({
      where: { email },
    }) as PrismaPromise<PersonModel | null>;

  public hasCPF = (CPF: string): PrismaPromise<PersonModel | null> =>
    this.prisma.person.findFirst({
      where: { CPF },
    }) as PrismaPromise<PersonModel | null>;

  public safetyDelete = (id: string): PrismaPromise<PersonModel> =>
    this.prisma.person.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });

  public findActivated = (
    clinicId: string,
    id: string,
    domainClass: string
  ): PrismaPromise<PersonModel | null> =>
    this.prisma.person.findFirst({
      where: {
        id,
        clinicId,
        domainClass,
        active: true,
      },
    });

  public findLiableToDelete = (
    clinicId: string,
    patientId: string
  ): PrismaPromise<{ person: Partial<PersonModel> | null }> =>
    this.prisma.liable.findFirst({
      where: {
        patientId,
        person: {
          clinicId,
          domainClass: UserDomainClasses.LIABLE,
        },
      },
      select: {
        person: { select: { id: true } },
      },
    }) as PrismaPromise<{ person: Partial<PersonModel> | null }>;

  public count = (
    clinicId: string,
    domainClass: string,
    filters: SearchPersonRequestModel | null
  ): PrismaPromise<number> =>
    this.prisma.person.count({
      where: {
        domainClass,
        active: true,
        clinicId,
        AND: [
          {
            name: {
              contains: filters?.name || "%",
              mode: "insensitive",
            },
          },
          {
            CPF: {
              contains: filters?.CPF || "%",
              mode: "default",
            },
          },
          {
            email: {
              contains: filters?.email || "%",
              mode: "insensitive",
            },
          },
        ],
      },
    });
}

export { PersonRepository };
