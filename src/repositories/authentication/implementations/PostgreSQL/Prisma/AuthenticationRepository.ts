import { prismaClient } from "@infra/database/client";
import { RoleModel } from "@models/utils/RoleModel";
import { PrismaPromise } from "@prisma/client";
import { IAuthenticationRepository } from "@repositories/authentication/models/IAuthenticationRepository";

class AuthenticationRepository implements IAuthenticationRepository {
  constructor(private prisma = prismaClient) {}

  public getRoleByName = (name: string): PrismaPromise<RoleModel | null> =>
    this.prisma.role.findFirst({
      where: { name },
    }) as PrismaPromise<RoleModel | null>;
}

export { AuthenticationRepository };
