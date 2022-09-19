import { ClinicModel } from "@models/domain/ClinicModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { UserModel } from "@models/domain/UserModel";
import { PermissionModel } from "@models/utils/PermissionModel";
import { RoleModel } from "@models/utils/RoleModel";
import { PrismaPromise } from "@prisma/client";

interface IAuthenticationRepository {
  getRoleByName(name: string): PrismaPromise<RoleModel | null>;
  getUserToRefreshToken(id: string): PrismaPromise<
    | (Partial<UserModel> & {
        person: Partial<PersonModel> & { clinic: Partial<ClinicModel> };
        role: { permissions: Partial<PermissionModel>[] };
        professional?: Partial<ProfessionalModel>;
      })
    | null
  >;
}

export { IAuthenticationRepository };
