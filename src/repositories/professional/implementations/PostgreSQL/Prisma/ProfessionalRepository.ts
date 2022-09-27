import { RolesKeys } from "@common/RolesKeys";
import { UserDomainClasses } from "@common/UserDomainClasses";
import { prismaClient } from "@infra/database/client";
import { AddressModel } from "@models/domain/AddressModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { UserModel } from "@models/domain/UserModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { clause2searchPeopleWithFilters } from "@repositories/person";
import { IProfessionalRepository } from "@repositories/professional/models/IProfessionalRepository";

class ProfessionalRepository implements IProfessionalRepository {
  constructor(private prisma = prismaClient) {}

  public getBaseDuration = (
    clinicId: string,
    professionalId: string
  ): PrismaPromise<{ id: string; baseDuration: number } | null> =>
    this.prisma.professional.findFirst({
      where: {
        id: professionalId,
        user: {
          person: {
            clinicId,
            active: true,
            domainClass: UserDomainClasses.PROFESSIONAL,
          },
        },
      },
      select: {
        id: true,
        baseDuration: true,
      },
    }) as PrismaPromise<{ id: string; baseDuration: number } | null>;

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
      UserModel & {
        person: PersonModel & { address: AddressModel };
        professional: ProfessionalModel;
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
                publicArea: true,
                state: true,
                zipCode: true,
              },
            },
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
        UserModel & {
          person: PersonModel & { address: AddressModel };
          professional: ProfessionalModel;
        }
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

  public getToUpdate = (
    clinicId: string,
    id: string
  ): PrismaPromise<
    | (Partial<ProfessionalModel> & {
        user: Partial<UserModel> & {
          person: Partial<PersonModel> & { address: AddressModel };
        };
      })
    | null
  > =>
    this.prisma.professional.findFirst({
      where: {
        id,
        user: {
          person: {
            clinicId,
            active: true,
            domainClass: UserDomainClasses.PROFESSIONAL,
          },
        },
      },
      select: {
        baseDuration: true,
        profession: true,
        registry: true,
        specialization: true,
        user: {
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
        },
      },
    }) as PrismaPromise<
      | (Partial<ProfessionalModel> & {
          user: Partial<UserModel> & {
            person: Partial<PersonModel> & { address: AddressModel };
          };
        })
      | null
    >;

  public updatePassword = (
    userId: string,
    password: string
  ): PrismaPromise<Partial<UserModel>> =>
    this.prisma.user.update({
      where: { id: userId },
      data: { password },
      select: { id: true, password: true },
    });

  public getProfile = (
    clinicId: string,
    id: string,
    domainClass: string
  ): PrismaPromise<{
    person: Partial<PersonModel> & { address: AddressModel };
    professional: Partial<ProfessionalModel>;
  } | null> =>
    this.prisma.user.findFirst({
      where: {
        id,
        blocked: false,
        person: {
          clinicId,
          active: true,
          domainClass,
        },
      },
      select: {
        professional: {
          select: {
            profession: true,
            registry: true,
            specialization: true,
          },
        },
        person: {
          select: {
            id: true,
            name: true,
            email: true,
            CPF: true,
            birthDate: true,
            domainClass: true,
            contactNumber: true,
            address: {
              select: {
                city: true,
                district: true,
                id: true,
                publicArea: true,
                state: true,
                zipCode: true,
              },
            },
          },
        },
      },
    }) as PrismaPromise<{
      person: Partial<PersonModel> & { address: AddressModel };
      professional: Partial<ProfessionalModel>;
    } | null>;

  public getNames = (
    clinicId: string,
    [take, skip]: [number, number]
  ): PrismaPromise<{ id: string; name: string }[]> =>
    this.prisma.person.findMany({
      where: {
        clinicId,
        active: true,
        domainClass: UserDomainClasses.PROFESSIONAL,
        user: {
          blocked: false,
          role: {
            name: RolesKeys.PROFESSIONAL,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
      take,
      skip,
    });

  public countNames = (clinicId: string): PrismaPromise<number> =>
    this.prisma.person.count({
      where: {
        clinicId,
        active: true,
        domainClass: UserDomainClasses.PROFESSIONAL,
        user: {
          blocked: false,
          role: {
            name: RolesKeys.PROFESSIONAL,
          },
        },
      },
    });

  public getToConfigure = (
    clinicId: string,
    id: string
  ): PrismaPromise<{ id: string; password: string } | null> =>
    this.prisma.user.findFirst({
      where: {
        id,
        blocked: false,
        role: {
          name: RolesKeys.PROFESSIONAL_UNCONFIGURED,
        },
        person: { clinicId, active: true },
      },
      select: {
        id: true,
        password: true,
      },
    }) as PrismaPromise<{ id: string; password: string } | null>;
}

export { ProfessionalRepository };
