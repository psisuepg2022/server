import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";

interface ILiableRepository {
  save(patientId: string, liableId: string): PrismaPromise<any>;
  hasLiablePersonSaved(
    id: string
  ): PrismaPromise<(any & { person: PersonModel }) | null>;
}

export { ILiableRepository };
