import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";

interface IPersonRepository {
  hasEmail(email: string): PrismaPromise<PersonModel | null>;
  save(person: PersonModel): PrismaPromise<PersonModel>;
}

export { IPersonRepository };
