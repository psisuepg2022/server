import { prismaClient } from "@infra/database/client";
import { AddressModel } from "@models/domain/AddressModel";
import { ClinicModel } from "@models/domain/ClinicModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { UserModel } from "@models/domain/UserModel";
import { PermissionModel } from "@models/utils/PermissionModel";
import { PrismaPromise } from "@prisma/client";
import { IUserRepository } from "@repositories/user/models/IUserRepository";

class UserRepository implements IUserRepository {
  constructor(private prisma = prismaClient) {}

  public save = (
    roleId: number,
    { password, userName, id }: UserModel
  ): PrismaPromise<
    Partial<UserModel> & { person: { clinic: { code: number } } }
  > =>
    this.prisma.user.upsert({
      where: { id },
      create: {
        password,
        userName,
        id,
        roleId,
      },
      update: { userName },
      select: {
        id: true,
        userName: true,
        person: { select: { clinic: { select: { code: true } } } },
      },
    }) as PrismaPromise<
      Partial<UserModel> & { person: { clinic: { code: number } } }
    >;

  public updateLoginControlProps = (
    userId: string,
    attempts: number,
    blocked: boolean
  ): PrismaPromise<Partial<UserModel>> =>
    this.prisma.user.update({
      where: { id: userId },
      data: {
        blocked,
        loginAttempts: attempts,
      },
      select: {
        blocked: true,
        loginAttempts: true,
        id: true,
      },
    });

  public hasUserName = (
    clinicId: string,
    id: string,
    userName: string
  ): PrismaPromise<UserModel | null> =>
    this.prisma.user.findFirst({
      where: {
        userName,
        id: { not: id },
        person: { clinicId },
      },
    }) as PrismaPromise<UserModel | null>;

  public hasActivatedUser = (
    userName: string,
    accessCode: number
  ): PrismaPromise<
    | (UserModel & {
        person: PersonModel & { clinic: ClinicModel };
        role: { name: string; permissions: Partial<PermissionModel>[] };
        professional?: Partial<ProfessionalModel>;
      })
    | null
  > =>
    this.prisma.user.findFirst({
      where: {
        userName,
        person: { active: true, clinic: { code: accessCode } },
      },
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
    }) as PrismaPromise<
      | (UserModel & {
          person: PersonModel & { clinic: ClinicModel };
          role: { name: string; permissions: Partial<PermissionModel>[] };
          professional?: Partial<ProfessionalModel>;
        })
      | null
    >;

  public verifyRole = (
    userId: string,
    role: string
  ): PrismaPromise<Partial<UserModel> | null> =>
    this.prisma.user.findFirst({
      where: {
        id: userId,
        role: {
          name: role,
        },
        person: { active: true },
        blocked: false,
      },
      select: { id: true },
    }) as PrismaPromise<Partial<UserModel> | null>;

  public findUserToResetPassword = (
    clinicId: string,
    userId: string
  ): PrismaPromise<{ id: string; password: string } | null> =>
    this.prisma.user.findFirst({
      where: {
        id: userId,
        blocked: false,
        person: {
          clinicId,
          active: true,
        },
      },
      select: {
        id: true,
        password: true,
      },
    });

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
    } | null>;

  public getToUpdate = (
    clinicId: string,
    id: string,
    domainClass: string
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
          domainClass,
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

export { UserRepository };
