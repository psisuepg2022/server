import { AddressModel } from "@models/domain/AddressModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { UserModel } from "@models/domain/UserModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
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
  updateBaseDuration(
    professionalId: string,
    baseDuration: number
  ): PrismaPromise<Partial<ProfessionalModel>>;
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
}

export { IProfessionalRepository };
