import { prismaClient } from "@infra/database/client";
import { UserModel } from "@models/domain/UserModel";
import { PrismaPromise } from "@prisma/client";
import { IUserRepository } from "@repositories/user/models/IUserRepository";

class UserRepository implements IUserRepository {
  constructor(private prisma = prismaClient) {}

  public save = ({
    password,
    userName,
    id,
  }: UserModel): PrismaPromise<Partial<UserModel>> =>
    this.prisma.user.create({
      data: {
        password,
        userName,
        id,
        roleId: "1e2ee182-ff07-11ec-b939-0242ac120002",
        accessCode: 1,
      },
    }) as PrismaPromise<Partial<UserModel>>;

  public hasUserName = (userName: string): PrismaPromise<UserModel | null> =>
    this.prisma.user.findFirst({
      where: { userName },
    }) as PrismaPromise<UserModel | null>;
}

export { UserRepository };
