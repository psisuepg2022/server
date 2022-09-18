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
  ): PrismaPromise<Partial<UserModel>> =>
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
        accessCode: true,
        id: true,
        userName: true,
      },
    }) as PrismaPromise<Partial<UserModel>>;

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
    id: string,
    userName: string
  ): PrismaPromise<UserModel | null> =>
    this.prisma.user.findFirst({
      where: {
        userName,
        id: { not: id },
      },
    }) as PrismaPromise<UserModel | null>;

  public hasActivatedUser = (
    userName: string,
    accessCode: number
  ): PrismaPromise<
    | (UserModel & {
        person: PersonModel & { clinic: ClinicModel };
        role: { permissions: Partial<PermissionModel>[] };
        professional?: Partial<ProfessionalModel>;
      })
    | null
  > =>
    this.prisma.user.findFirst({
      where: { userName, accessCode, person: { active: true } },
      select: {
        password: true,
        blocked: true,
        loginAttempts: true,
        accessCode: true,
        userName: true,
        id: true,
        role: {
          select: {
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
          role: { permissions: Partial<PermissionModel>[] };
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
    id: string
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
        },
      },
      select: {
        person: {
          select: {
            id: true,
            name: true,
            email: true,
            CPF: true,
            birthDate: true,
            domainClass: true,
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
}

export { UserRepository };
