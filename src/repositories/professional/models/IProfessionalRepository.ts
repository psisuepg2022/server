import { AddressModel } from "@models/domain/AddressModel";
import { ClinicModel } from "@models/domain/ClinicModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { UserModel } from "@models/domain/UserModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { PermissionModel } from "@models/utils/PermissionModel";
import { PrismaPromise } from "@prisma/client";

interface IProfessionalRepository {
  save(
    userId: string,
    professional: ProfessionalModel
  ): PrismaPromise<Partial<ProfessionalModel>>;
  get(
    clinicId: string,
    [take, skip]: [number, number],
    filters: SearchPersonRequestModel | null
  ): PrismaPromise<
    Partial<
      UserModel & {
        person: PersonModel & { address: AddressModel };
        professional: ProfessionalModel;
      }
    >[]
  >;
  getBaseDuration(
    clinicId: string,
    professionalId: string
  ): PrismaPromise<{ id: string; baseDuration: number } | null>;
  getToUpdate(
    clinicId: string,
    id: string
  ): PrismaPromise<
    | (Partial<ProfessionalModel> & {
        user: Partial<UserModel> & {
          person: Partial<PersonModel> & { address: AddressModel };
        };
      })
    | null
  >;
  getProfile(
    clinicId: string,
    id: string,
    domainClass: string
  ): PrismaPromise<{
    person: Partial<PersonModel> & { address: AddressModel };
    professional: Partial<ProfessionalModel>;
  } | null>;
  getNames(
    clinicId: string,
    [take, skip]: [number, number]
  ): PrismaPromise<
    {
      id: string;
      name: string;
      user: { professional: { baseDuration: number } };
    }[]
  >;
  countNames(clinicId: string): PrismaPromise<number>;
  getToConfigure(
    clinicId: string,
    id: string
  ): PrismaPromise<{ id: string; password: string } | null>;
  configure(
    id: string,
    roleId: number,
    baseDuration: number,
    password: string
  ): PrismaPromise<
    | UserModel & {
        person: PersonModel & { clinic: ClinicModel };
        role: { name: string; permissions: Partial<PermissionModel>[] };
        professional?: Partial<ProfessionalModel>;
      }
  >;
  hasPatientWithPastAppointments(
    professionalId: string,
    patientId: string
  ): PrismaPromise<{ id: string } | null>;
}

export { IProfessionalRepository };
