import { UserModel } from "@models/domain/UserModel";
import { PrismaPromise } from "@prisma/client";

interface IUserRepository {
  hasUserName(userName: string): PrismaPromise<UserModel | null>;
  save(user: UserModel): PrismaPromise<Partial<UserModel>>;
}

export { IUserRepository };
