import { AddressModel } from "@models/domain/AddressModel";
import { ClinicModel } from "@models/domain/ClinicModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { UserModel } from "@models/domain/UserModel";
import { PermissionModel } from "@models/utils/PermissionModel";
import { PrismaPromise } from "@prisma/client";

interface IUserRepository {
  hasUserName(id: string, userName: string): PrismaPromise<UserModel | null>;
  hasActivatedUser(
    userName: string,
    accessCode: number
  ): PrismaPromise<
    | (UserModel & {
        person: PersonModel & { clinic: ClinicModel };
        role: { name: string; permissions: Partial<PermissionModel>[] };
        professional?: Partial<ProfessionalModel>;
      })
    | null
  >;
  save(roleId: number, user: UserModel): PrismaPromise<Partial<UserModel>>;
  updateLoginControlProps(
    userId: string,
    attempts: number,
    blocked: boolean
  ): PrismaPromise<Partial<UserModel>>;
  verifyRole(
    userId: string,
    role: string
  ): PrismaPromise<Partial<UserModel> | null>;
  findUserToResetPassword(
    clinicId: string,
    userId: string
  ): PrismaPromise<{ id: string; password: string } | null>;
  updatePassword(
    userId: string,
    password: string
  ): PrismaPromise<Partial<UserModel>>;
  getProfile(
    clinicId: string,
    id: string,
    domainClass: string
  ): PrismaPromise<{
    person: Partial<PersonModel> & { address: AddressModel };
  } | null>;
  getToUpdate(
    clinicId: string,
    id: string,
    domainClass: string
  ): PrismaPromise<
    | (Partial<UserModel> & {
        person: Partial<PersonModel> & { address: AddressModel };
      })
    | null
  >;
}

export { IUserRepository };
