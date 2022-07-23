import { OwnerModel } from "@models/domain/OwnerModel";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";

interface IOwnerRepository {
  get([take, skip]: [number, number]): PrismaPromise<
    Partial<OwnerModel & { person: PersonModel }>[]
  >;
}

export { IOwnerRepository };
