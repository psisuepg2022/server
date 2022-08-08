import { UserDomainClasses } from "@common/UserDomainClasses";
import { prismaClient } from "@infra/database/client";
import { PersonModel } from "@models/domain/PersonModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { ILiableRepository } from "@repositories/liable/models/ILiableRepository";
import { clause2searchPeopleWithFilters } from "@repositories/person";

class LiableRepository implements ILiableRepository {
  constructor(private prisma = prismaClient) {}

  public save = (patientId: string, liableId: string): PrismaPromise<any> =>
    this.prisma.liable.create({
      data: {
        patientId,
        personId: liableId,
      },
    });

  public hasLiablePersonSaved = (
    id: string
  ): PrismaPromise<(any & { person: PersonModel }) | null> =>
    this.prisma.liable.findFirst({
      where: { personId: id },
      select: {
        person: {
          select: {
            email: true,
            name: true,
            CPF: true,
            birthDate: true,
            contactNumber: true,
          },
        },
      },
    }) as PrismaPromise<(any & { person: PersonModel }) | null>;

  public get = (
    clinicId: string,
    [take, skip]: [number, number],
    filters: SearchPersonRequestModel | null
  ): PrismaPromise<(any & { person: Partial<PersonModel> })[]> =>
    this.prisma.liable.findMany({
      where: {
        person: {
          clinicId,
          domainClass: UserDomainClasses.LIABLE,
          active: true,
          AND: clause2searchPeopleWithFilters(filters),
        },
      },
      select: {
        person: {
          select: {
            birthDate: true,
            contactNumber: true,
            CPF: true,
            email: true,
            name: true,
            id: true,
          },
        },
      },
      take,
      skip,
    }) as PrismaPromise<(any & { person: Partial<PersonModel> })[]>;
}

export { LiableRepository };
