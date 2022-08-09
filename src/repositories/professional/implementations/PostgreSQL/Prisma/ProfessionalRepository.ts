import { UserDomainClasses } from "@common/UserDomainClasses";
import { prismaClient } from "@infra/database/client";
import { PersonModel } from "@models/domain/PersonModel";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { UserModel } from "@models/domain/UserModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { clause2searchPeopleWithFilters } from "@repositories/person";
import { IProfessionalRepository } from "@repositories/professional/models/IProfessionalRepository";

class ProfessionalRepository implements IProfessionalRepository {
  constructor(private prisma = prismaClient) {}

  public save = (
    userId: string,
    { baseDuration, profession, registry, specialization }: ProfessionalModel
  ): PrismaPromise<Partial<ProfessionalModel>> =>
    this.prisma.professional.upsert({
      where: { id: userId },
      create: {
        profession,
        registry,
        baseDuration,
        specialization,
        id: userId,
      },
      update: {
        profession,
        registry,
        baseDuration,
        specialization,
      },
      select: {
        profession: true,
        baseDuration: true,
        registry: true,
        specialization: true,
      },
    }) as PrismaPromise<Partial<ProfessionalModel>>;

  public get = (
    clinicId: string,
    [take, skip]: [number, number],
    filters: SearchPersonRequestModel | null
  ): PrismaPromise<
    Partial<
      UserModel & { person: PersonModel; professional: ProfessionalModel }
    >[]
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
        professional: {
          select: {
            baseDuration: true,
            profession: true,
            specialization: true,
            registry: true,
          },
        },
      },
      where: {
        person: {
          domainClass: UserDomainClasses.PROFESSIONAL,
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
        UserModel & { person: PersonModel; professional: ProfessionalModel }
      >[]
    >;

  public updateBaseDuration = (
    professionalId: string,
    baseDuration: number
  ): PrismaPromise<Partial<ProfessionalModel>> =>
    this.prisma.professional.update({
      where: { id: professionalId },
      data: { baseDuration },
      select: {
        id: true,
        baseDuration: true,
      },
    }) as PrismaPromise<Partial<ProfessionalModel>>;
}

export { ProfessionalRepository };
