import { prismaClient } from "@infra/database/client";
import { ClinicModel } from "@models/domain/ClinicModel";
import { PersonModel } from "@models/domain/PersonModel";
import { UserModel } from "@models/domain/UserModel";
import { PrismaPromise } from "@prisma/client";
import { IUserRepository } from "@repositories/user/models/IUserRepository";

class UserRepository implements IUserRepository {
  constructor(private prisma = prismaClient) {}

  public save = (
    roleId: number,
    { password, userName, id }: UserModel
  ): PrismaPromise<Partial<UserModel>> =>
    this.prisma.user.create({
      data: {
        password,
        userName,
        id,
        roleId,
      },
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

  public hasUserName = (userName: string): PrismaPromise<UserModel | null> =>
    this.prisma.user.findFirst({
      where: { userName },
    }) as PrismaPromise<UserModel | null>;

  public hasUser = (
    userName: string,
    accessCode: number
  ): PrismaPromise<
    (UserModel & { person: PersonModel & { clinic: ClinicModel } }) | null
  > =>
    this.prisma.user.findFirst({
      where: { userName, accessCode },
      select: {
        password: true,
        blocked: true,
        loginAttempts: true,
        accessCode: true,
        userName: true,
        id: true,
        person: {
          select: {
            name: true,
            email: true,
            clinic: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }) as PrismaPromise<
      (UserModel & { person: PersonModel & { clinic: ClinicModel } }) | null
    >;

  public count = (domainClass: string): PrismaPromise<number> =>
    this.prisma.user.count({
      where: {
        person: {
          domainClass,
          active: true,
        },
      },
    });
}

export { UserRepository };
