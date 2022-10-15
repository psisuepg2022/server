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
    this.prisma.liable.upsert({
      where: { patientId },
      create: {
        patientId,
        personId: liableId,
      },
      update: {
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
            id: true,
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
  ): PrismaPromise<Partial<PersonModel>[]> =>
    this.prisma.person.findMany({
      where: {
        clinicId,
        domainClass: UserDomainClasses.LIABLE,
        active: true,
        AND: clause2searchPeopleWithFilters(filters),
      },
      select: {
        birthDate: true,
        contactNumber: true,
        CPF: true,
        email: true,
        name: true,
        id: true,
      },
      take,
      skip,
    }) as PrismaPromise<Partial<PersonModel>[]>;

  public hasByPatient = (patientId: string): PrismaPromise<any | null> =>
    this.prisma.liable.findFirst({
      where: {
        patientId,
        patient: {
          person: { active: true },
        },
      },
    });

  public unlink = (patientId: string): PrismaPromise<any> =>
    this.prisma.liable.delete({ where: { patientId } });
}

export { LiableRepository };
