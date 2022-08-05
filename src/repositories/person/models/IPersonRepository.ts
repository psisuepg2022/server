import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";

interface IPersonRepository {
  hasEmail(email: string): PrismaPromise<PersonModel | null>;
  hasCPF(cpf: string): PrismaPromise<PersonModel | null>;
  save(
    clinicId: string,
    person: PersonModel
  ): PrismaPromise<Partial<PersonModel>>;
  safetyDelete(id: string): PrismaPromise<PersonModel>;
  findToDelete(
    clinicId: string,
    id: string,
    domainClass: string
  ): PrismaPromise<PersonModel | null>;
  findLiableToDelete(
    clinicId: string,
    patientId: string
  ): PrismaPromise<{ person: Partial<PersonModel> | null }>;
}

export { IPersonRepository };
