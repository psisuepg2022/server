import { ClinicModel } from "@models/domain/ClinicModel";
import { PersonModel } from "@models/domain/PersonModel";
import { UserModel } from "@models/domain/UserModel";
import { PermissionModel } from "@models/utils/PermissionModel";
import { PrismaPromise } from "@prisma/client";

interface IUserRepository {
  hasUserName(userName: string): PrismaPromise<UserModel | null>;
  hasUser(
    userName: string,
    accessCode: number
  ): PrismaPromise<
    | (UserModel & {
        person: PersonModel & { clinic: ClinicModel };
        role: { permissions: Partial<PermissionModel>[] };
      })
    | null
  >;
  save(roleId: number, user: UserModel): PrismaPromise<Partial<UserModel>>;
  count(clinicId: string, domainClass: string): PrismaPromise<number>;
  updateLoginControlProps(
    userId: string,
    attempts: number,
    blocked: boolean
  ): PrismaPromise<Partial<UserModel>>;
}

export { IUserRepository };
