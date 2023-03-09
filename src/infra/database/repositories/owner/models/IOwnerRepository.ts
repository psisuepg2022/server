import { OwnerModel } from "@models/domain/OwnerModel";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";

interface IOwnerRepository {
  get(
    clinicId: string,
    [take, skip]: [number, number]
  ): PrismaPromise<
    Partial<
      OwnerModel & { person: PersonModel & { clinic: { code: number } } }
    >[]
  >;
}

export { IOwnerRepository };
