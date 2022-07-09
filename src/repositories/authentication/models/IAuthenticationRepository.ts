import { RoleModel } from "@models/utils/RoleModel";
import { PrismaPromise } from "@prisma/client";

interface IAuthenticationRepository {
  getRoleByName(name: string): PrismaPromise<RoleModel | null>;
}

export { IAuthenticationRepository };
