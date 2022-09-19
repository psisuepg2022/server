import { prismaClient } from "@infra/database/client";
import { ClinicModel } from "@models/domain/ClinicModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { UserModel } from "@models/domain/UserModel";
import { PermissionModel } from "@models/utils/PermissionModel";
import { RoleModel } from "@models/utils/RoleModel";
import { PrismaPromise } from "@prisma/client";
import { IAuthenticationRepository } from "@repositories/authentication/models/IAuthenticationRepository";

class AuthenticationRepository implements IAuthenticationRepository {
  constructor(private prisma = prismaClient) {}

  public getRoleByName = (name: string): PrismaPromise<RoleModel | null> =>
    this.prisma.role.findFirst({
      where: { name },
    }) as PrismaPromise<RoleModel | null>;

  public getUserToRefreshToken = (
    id: string
  ): PrismaPromise<
    | (Partial<UserModel> & {
        person: Partial<PersonModel> & { clinic: Partial<ClinicModel> };
        role: { permissions: Partial<PermissionModel>[] };
        professional?: Partial<ProfessionalModel>;
      })
    | null
  > =>
    this.prisma.user.findFirst({
      where: {
        id,
        blocked: false,
        person: { active: true },
      },
      select: {
        id: true,
        professional: { select: { baseDuration: true } },
        person: {
          select: {
            domainClass: true,
            clinic: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        role: {
          select: {
            permissions: { select: { name: true } },
          },
        },
      },
    }) as PrismaPromise<
      | (Partial<UserModel> & {
          person: Partial<PersonModel> & { clinic: Partial<ClinicModel> };
          role: { permissions: Partial<PermissionModel>[] };
          professional?: Partial<ProfessionalModel>;
        })
      | null
    >;
}

export { AuthenticationRepository };
