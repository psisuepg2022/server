import { RolesKeys } from "@common/RolesKeys";
import { UserDomainClasses } from "@common/UserDomainClasses";
import { prismaClient } from "@infra/database/client";
import { AddressModel } from "@models/domain/AddressModel";
import { ClinicModel } from "@models/domain/ClinicModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { UserModel } from "@models/domain/UserModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { PermissionModel } from "@models/utils/PermissionModel";
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
        person: PersonModel & {
          address: AddressModel;
          clinic: { code: number };
        };
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
            clinic: { select: { code: true } },
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
          person: PersonModel & {
            address: AddressModel;
            clinic: { code: number };
          };
          professional: ProfessionalModel;
        }
      >[]
    >;

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
        userName: true,
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
  ): PrismaPromise<
    {
      id: string;
      name: string;
      user: { professional: { baseDuration: number } };
    }[]
  > =>
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
        user: {
          select: {
            professional: { select: { baseDuration: true } },
          },
        },
      },
      orderBy: { name: "asc" },
      take,
      skip,
    }) as PrismaPromise<
      {
        id: string;
        name: string;
        user: { professional: { baseDuration: number } };
      }[]
    >;

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

  public configure = (
    id: string,
    roleId: number,
    baseDuration: number,
    password: string
  ): PrismaPromise<
    | UserModel & {
        person: PersonModel & { clinic: ClinicModel };
        role: { name: string; permissions: Partial<PermissionModel>[] };
        professional?: Partial<ProfessionalModel>;
      }
  > =>
    this.prisma.user.update({
      where: { id },
      data: { roleId, professional: { update: { baseDuration } }, password },
      select: {
        password: true,
        blocked: true,
        loginAttempts: true,
        userName: true,
        id: true,
        role: {
          select: {
            name: true,
            permissions: { select: { name: true } },
          },
        },
        person: {
          select: {
            name: true,
            email: true,
            domainClass: true,
            clinic: {
              select: {
                id: true,
                name: true,
                email: true,
                code: true,
              },
            },
          },
        },
        professional: {
          select: {
            baseDuration: true,
          },
        },
      },
    }) as unknown as PrismaPromise<
      | UserModel & {
          person: PersonModel & { clinic: ClinicModel };
          role: { name: string; permissions: Partial<PermissionModel>[] };
          professional?: Partial<ProfessionalModel>;
        }
    >;

  public hasPatientWithPastAppointments = (
    professionalId: string,
    patientId: string
  ): PrismaPromise<{ id: string } | null> =>
    this.prisma.appointment.findFirst({
      where: {
        professionalId,
        patientId,
      },
      select: { id: true },
    });
}

export { ProfessionalRepository };
