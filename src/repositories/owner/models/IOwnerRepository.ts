import { AddressModel } from "@models/domain/AddressModel";
import { OwnerModel } from "@models/domain/OwnerModel";
import { PersonModel } from "@models/domain/PersonModel";
import { UserModel } from "@models/domain/UserModel";
import { PrismaPromise } from "@prisma/client";

interface IOwnerRepository {
  get(
    clinicId: string,
    [take, skip]: [number, number]
  ): PrismaPromise<Partial<OwnerModel & { person: PersonModel }>[]>;
  getToUpdate(
    clinicId: string,
    id: string
  ): PrismaPromise<
    | (Partial<UserModel> & {
        person: Partial<PersonModel> & { address: AddressModel };
      })
    | null
  >;
}

export { IOwnerRepository };
