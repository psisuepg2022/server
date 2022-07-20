import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";

interface IPersonRepository {
  hasEmail(email: string): PrismaPromise<PersonModel | null>;
  hasCPF(cpf: string): PrismaPromise<PersonModel | null>;
  save(
    clinicId: string,
    person: PersonModel
  ): PrismaPromise<Partial<PersonModel>>;
}

export { IPersonRepository };
