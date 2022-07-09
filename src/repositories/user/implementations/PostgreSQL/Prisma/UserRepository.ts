import { prismaClient } from "@infra/database/client";
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
        accessCode: 1,
      },
      select: {
        accessCode: true,
        id: true,
        userName: true,
      },
    }) as PrismaPromise<Partial<UserModel>>;

  public hasUserName = (userName: string): PrismaPromise<UserModel | null> =>
    this.prisma.user.findFirst({
      where: { userName },
    }) as PrismaPromise<UserModel | null>;
}

export { UserRepository };
